import { AbiFunction } from "abitype";
import Code from "./Code";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

const Function = ({ name, inputs }: AbiFunction) => (
  <Card className="flex-1">
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl font-mono">{name}</CardTitle>
      <CardDescription>
        {/* <Code
          text={`function ${name}(${inputs
            .map(({ name, type }) => `${type} ${name}`)
            .join(",")})`}
        /> */}
      </CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4">
      {inputs.map(({ type, name }) => (
        <div className="grid gap-2">
          <Label htmlFor="email">{name}</Label>
          <Input type="text" placeholder={`${type} ${name}`} />
        </div>
      ))}
      <Button>Send</Button>
    </CardContent>
  </Card>
);

export default Function;
