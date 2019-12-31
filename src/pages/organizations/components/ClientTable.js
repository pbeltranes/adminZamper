///
//
// NO ESTA EN USO!
//
//
import React from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@material-ui/core";

// components
import { Button } from "../../../components/Wrappers/Wrappers";

const states = {
  sent: "success",
  pending: "warning",
  declined: "secondary",
};

export default function TableComponent( data ) {
  console.log("pasa la data oe", data)
  var keys = Object.keys(data[0]).map(i => i.toUpperCase());
  keys.shift(); // delete "id" key

  return (
    <Table className="mb-0">
      <TableHead>
        <TableRow>
          {keys.map(key => (
            <TableCell key={key}>{key}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(({ id, name_usuario, invoice_email, invoice_phone, cellphone, keys_json, estado_api,status}) => (
          <TableRow key={id}>
            <TableCell className="pl-3 fw-normal">{name}</TableCell>
            <TableCell>{id}</TableCell>
            <TableCell>{name_usuario}</TableCell>
            <TableCell>{invoice_email}</TableCell>
            <TableCell>{invoice_phone}</TableCell>
            <TableCell>{keys_json}</TableCell>
            <TableBody>{estado_api}</TableBody>
            <TableCell>
              <Button
                color={states[status.toLowerCase()]}
                size="small"
                className="px-2"
                variant="contained"
              >
                {status}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
