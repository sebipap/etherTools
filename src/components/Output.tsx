import { AbiParameter } from "abitype";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";

const Data = ({ data, type }: { data: any; type: string }) => {
  if (type.includes("int")) return String(data);
  if (type === "address") return data;

  if (type === "tuple")
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
};

const Output = ({
  data,
  outputs,
}: {
  data: unknown;
  outputs: readonly AbiParameter[];
}) => {
  if (data === undefined) return "No response";
  if (outputs.length === 0) return null;
  if (outputs.length === 1 || !Array.isArray(data)) return String(data);

  return (
    <Table className="font-mono">
      <TableBody>
        {outputs.map(({ name, type }, index) => (
          <TableRow key={name}>
            <TableCell>
              {name} <Badge variant="outline">{type}</Badge>{" "}
            </TableCell>
            <TableCell>{<Data data={data?.[index]} type={type} />}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Output;
