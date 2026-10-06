// screen-and-source.mapper.ts
import { ApplicationScreen as DomainScreen } from "../../../../../../../domain/entities/application";
import { ExpenseSource as DomainExpenseSource } from "../../../../../../../domain/entities/collected-expsense-data";

import {
  ApplicationScreen as SchemaScreen,
  ExpenseSource as SchemaExpenseSource,
  ExpenseItem as SchemaExpenseItem,
} from "../../../../schema";

export function mapDomainToSchemaScreen(screen: DomainScreen): SchemaScreen {
  const schemaScreen =
    SchemaScreen[screen as unknown as keyof typeof SchemaScreen];
  if (!schemaScreen) {
    throw new Error(
      `mapDomainToSchemaScreen: no schema screen found for domain screen "${screen}".`,
    );
  }

  return schemaScreen;
}

export function mapDomainToSchemaExpenseSource(
  source: DomainExpenseSource,
): SchemaExpenseSource {
  const schemaSource =
    SchemaExpenseSource[source as unknown as keyof typeof SchemaExpenseSource];

  if (!schemaSource) {
    throw new Error(
      `mapDomainToSchemaExpenseSource: no schema source found for domain source "${source}".`,
    );
  }

  return schemaSource;
}

export function mapExpenseItems(
  items: { name: string; amount: number; source: DomainExpenseSource }[],
): SchemaExpenseItem[] {
  return items.map((item) => ({
    name: item.name,
    amount: item.amount,
    source: mapDomainToSchemaExpenseSource(item.source),
  }));
}
