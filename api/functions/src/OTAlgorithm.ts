import diff = require("fast-diff");

interface IOperation {
  op: string;
  value: string;
}

export function makeOps(prevText = '', currentText = '') {
  const diffResult = diff(prevText, currentText);

  const ops: IOperation[] = [];
  diffResult.forEach(component => {
    switch (component[0]) {
      case diff.INSERT:
        ops.push({
          op: 'insert',
          value: component[1]
        });
        break;

      case diff.EQUAL:
        ops.push({
          op: 'retain',
          value: component[1]
        });
        break;

      case diff.DELETE:
        ops.push({
          op: 'delete',
          value: component[1]
        });
        break;
    }
  });

  return ops;
}
