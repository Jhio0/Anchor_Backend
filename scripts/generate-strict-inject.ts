import { glob } from "glob";
import * as path from "path";
import * as fs from "fs";

/**
 * Build Script for strict-inject System
 *
 * This script automatically:
 * 1. Scans for decorators (@Repository, @Provider, @Producer, etc.)
 * 2. Generates token enums
 * 3. Creates strict-inject wrapper
 * 4. Generates registration files
 * 5. Updates dependency registry
 */

interface TokenInfo {
  name: string;
  category: string;
  filePath: string;
  className: string;
}

interface DecoratorInfo {
  decorator: string;
  name: string;
  category: string;
  filePath: string;
  className: string;
}

class StrictInjectGenerator {
  private srcDir = "./src";
  private outputDir = "./src/lib";
  private tokens: TokenInfo[] = [];
  private decorators: DecoratorInfo[] = [];

  async generate() {
    console.log("🚀 Starting strict-inject generation...");
    ``;
    // Step 1: Scan for decorators
    await this.scanDecorators();

    // Step 2: Generate token files
    await this.generateTokenFiles();

    // Step 3: Generate strict-inject wrapper
    await this.generateStrictInject();

    // Step 4: Generate registration files
    await this.generateRegistrationFiles();

    console.log("✅ strict-inject generation complete!");
  }

  private async scanDecorators() {
    console.log("📡 Scanning for decorators...");

    const patterns = [
      "**/*.repository.adapter.ts",
      "**/*.provider.adapter.ts",
      "**/*.producer.adapter.ts",
      "**/*.repository.hook.ts",
    ];

    for (const pattern of patterns) {
      const files = await glob(pattern, { cwd: this.srcDir });

      for (const file of files) {
        const filePath = path.join(this.srcDir, file);
        const content = fs.readFileSync(filePath, "utf8");

        // Scan for @Repository decorators
        const repositoryMatch = content.match(
          /@Repository\s*\(\s*['"`]([^'"`]+)['"`]/,
        );
        if (repositoryMatch) {
          const className = this.extractClassName(content);
          this.decorators.push({
            decorator: "Repository",
            name: repositoryMatch[1] + "Repository",
            category: "Repository",
            className,
            filePath: file,
          });
        }

        // Scan for @Provider decorators
        const providerMatch = content.match(
          /@Provider(?:\s*\(\s*['"`]([^'"`]+)['"`]?[^)]*\))?/,
        );
        if (providerMatch) {
          const className = this.extractClassName(content);
          this.decorators.push({
            decorator: "Provider",
            name: providerMatch[1] || className,
            category: "Provider",
            className,
            filePath: file,
          });
        }

        // // Scan for @Producer decorators
        // const producerMatch = content.match(/@Producer\s*\(\s*['"`]([^'"`]+)['"`]/);
        // if (producerMatch) {
        //     const className = this.extractClassName(content);
        //     this.decorators.push({
        //         decorator: 'Producer',
        //         name: producerMatch[1],
        //         category: 'Producer',
        //         className,
        //         filePath: file,
        //     });
        // }
      }
    }

    console.log(`Found ${this.decorators.length} decorators`);
  }

  private extractClassName(content: string): string {
    const classMatch = content.match(/class\s+(\w+)/);
    return classMatch ? classMatch[1] : "Unknown";
  }

  private async generateTokenFiles() {
    console.log("🔑 Generating token files...");

    // Group decorators by category
    const categories = this.groupByCategory();

    for (const [category, decorators] of Object.entries(categories)) {
      await this.generateTokenFile(category, decorators);
    }
  }

  private groupByCategory() {
    const categories: { [key: string]: DecoratorInfo[] } = {};

    for (const decorator of this.decorators) {
      if (!categories[decorator.category]) {
        categories[decorator.category] = [];
      }
      categories[decorator.category].push(decorator);
    }

    return categories;
  }

  private async generateTokenFile(
    category: string,
    decorators: DecoratorInfo[],
  ) {
    const tokenName = `${category}Tokens`;
    const typeName = `${category}TokensType`;

    const enumContent = decorators
      .map((d) => `  ${d.name} = '${d.name}',`)
      .join("\n");

    const content = `// ******** THIS FILE IS GENERATED, MANUAL CHANGES WILL BE OVERWRITTEN ******** //

enum ${tokenName} {
${enumContent}
}

type ${typeName} = keyof typeof ${tokenName};

export { ${tokenName}, ${typeName} };
        `;

    const outputPath = path.join(
      this.outputDir,
      "injection-tokens",
      `${category.toLowerCase()}-tokens.ts`,
    );

    // Get the directory (folder) part of the path
    const outputDir = path.dirname(outputPath);

    // Make sure the directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, content);

    console.log(`Generated ${outputPath}`);
  }

  private async generateStrictInject() {
    console.log("💉 Generating strict-inject wrapper...");

    const categories = Object.keys(this.groupByCategory());
    const imports = categories
      .map(
        (cat) =>
          `import { ${cat}TokensType } from './injection-tokens/${cat.toLowerCase()}-tokens';`,
      )
      .join("\n");

    const unionType = categories
      .map((cat) => `${cat}TokensType`)
      .join("\n  | ");

    const content = `// ******** THIS FILE IS GENERATED, MANUAL CHANGES WILL BE OVERWRITTEN ******** //
        
${imports}
const tsyringe_ = require("tsyringe");

function _inject(token: string) {
    return(0, tsyringe_.inject)(token)
}

function strictInjectDecoratorFactory<T>(){
    return _inject
}

const inject = strictInjectDecoratorFactory<
${unionType}
>();

export { inject};
            `;

    const outputPath = path.join(this.outputDir, "strict-inject.ts");
    fs.writeFileSync(outputPath, content);

    console.log(`Generated ${outputPath}`);
  }

  private async generateRegistrationFiles() {
    console.log("📝 Generating registration files...");

    const categories = this.groupByCategory();

    for (const [category, decorators] of Object.entries(categories)) {
      await this.generateRegistrationFile(category, decorators);
    }
  }

  private async generateRegistrationFile(
    category: string,
    decorators: DecoratorInfo[],
  ) {
    const functionName = `register${category}s`;

    // Determine if this category needs Mongoose (only Repository)
    const needsMongoose = category === "Repository";

    // Import each decorator class
    const imports = decorators
      .map((d) => {
        const normalizedPath = d.filePath
          .replace(/\\/g, "/")
          .replace(/\.ts$/, "");
        return `import { ${d.className} } from '../../${normalizedPath}';`;
      })
      .join("\n");

    // Conditional Mongoose imports
    const mongooseImports = needsMongoose
      ? `import { DependencyRegistry, createMongoose, instanceCachingFactory } from 'myLibrary';
import config from "config-dug";
import { Mongoose } from "mongoose";`
      : `import { DependencyRegistry } from 'myLibrary';`;

    // Conditional Mongoose registration
    const mongooseRegistration = needsMongoose
      ? ` this.container.register(Mongoose, {
    useFactory: instanceCachingFactory(() =>
      createMongoose(process.env.MONGODB_URI as string)
    ),
  });`
      : "";

    // Decorator registrations
    const registrations = decorators.map((d) => `  ${d.className};`).join("\n");

    // Full file content
    const content = `// ******** THIS FILE IS GENERATED, MANUAL CHANGES WILL BE OVERWRITTEN ******** //

${mongooseImports}
${imports}

function ${functionName}(this: DependencyRegistry): void {${mongooseRegistration}
${registrations}
}

export { ${functionName} };
`;

    // Write the file
    const outputPath = path.join(
      "./src/configuration/dependency-registries",
      `${category.toLowerCase()}s.ts`,
    );
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, content);

    console.log(`Generated ${outputPath}`);
  }
}

// Run the generator
async function main() {
  const generator = new StrictInjectGenerator();
  await generator.generate();
}

if (require.main === module) {
  main().catch(console.error);
}
