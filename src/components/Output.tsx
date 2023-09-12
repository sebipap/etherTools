import { AbiParameter } from "abitype";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";

const Data = ({ data, type }: { data: any; type: string }) => {
  if (type.includes("int")) return String(data);
  if (type === "address") return data;
  if (type === "tuple") {
    return (
      <Table>
        <TableBody>
          {Object.entries(data).map(([key, value]) => (
            <TableRow>
              <TableCell>{key}</TableCell>
              <TableCell>{String(value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  if (type === "tuple[]") return <Data data={data} type="tuple" />;
  return String(data);
};

const Output = ({
  data,
  outputs,
}: {
  data: unknown;
  outputs: readonly AbiParameter[];
}) => {
  if (data === undefined || data === null) return "No response";
  if (outputs.length === 0) return null;
  if (!Array.isArray(data)) return <Data data={data} type={outputs[0].type} />;
  const multiple = data.length !== outputs.length;

  return (
    <Table className="font-mono">
      <TableBody>
        {data.map((dataPart, index) => {
          const { type: outputType, name } = multiple
            ? outputs[0]
            : outputs[index];
          const type = multiple ? outputType.replace("[]", "") : outputType;
          return (
            <TableRow key={`${name}-${index}`}>
              <TableCell>
                {name} <Badge variant="outline">{type}</Badge>{" "}
              </TableCell>
              <TableCell>{<Data data={dataPart} type={type} />}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default Output;
