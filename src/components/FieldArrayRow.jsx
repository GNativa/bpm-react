import { Col, Button } from "react-bootstrap";
import SectionRow from "./layout/SectionRow";
import Column from "./layout/Column";
import { useDependentFieldArrayValidations } from "../validation/helpers";

function buildIds(idList, arrayName, index) {
  const idObject = {};

  for (const id of idList) {
    idObject[id] = `${arrayName}.${index}.${id}`;
  }

  return idObject;
}

/**
 * @param {{
 *  form: import("react-hook-form").UseFormReturn,
 *  field: string, 
 *  arrayName: string,
 *  index: number,
 *  fieldNames: string[],
 *  validationDependencies: Object[],
 *  rowBuilder: function(FieldArrayRowBuilder): import("react").JSX.Element
 *  removeFunction: function,
 * }}
 * @returns
 */
export default function FieldArrayRow({
  form,
  field,
  arrayName,
  index,
  fieldNames,
  validationDependencies = [],
  rowBuilder,
  removeFunction,
}) {
  const mappedDependencies = validationDependencies.map((v) => ({
    form,
    arrayName,
    index,
    dependency: v,
  }));

  const watched = useDependentFieldArrayValidations(
    form,
    mappedDependencies
  );

  const rowFields = buildIds(fieldNames, arrayName, index);

  const columns = rowBuilder({
    field,
    index,
    rowFields,
    watched,
    rowErrors: form.formState.errors?.[arrayName]?.[index],
  });

  return (
    <SectionRow>
      {removeFunction && (
        <Col xs="12" className="d-flex justify-content-end">
          <Button onClick={() => removeFunction(index)} size="sm">
            <i className="bi bi-dash fs-5" />
          </Button>
        </Col>
      )}

      {columns.map((column, columnIndex) => (
        <Column
          key={columnIndex}
          visible={column.visible ?? undefined}
          width={column.width ?? undefined}
          breakAfter={column.breakAfter ?? undefined}
        >
          {Array.isArray(column.children)
            ? column.children.map((child, i) => (
                <span key={i}>{child}</span>
              ))
            : column.children}
        </Column>
      ))}
    </SectionRow>
  );
}