import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type MedicineRow = {
  id: string;
  prescribedName: string;
  brandedPrice: number;
  genericName: string;
  genericPrice: number;
  approval: "pending" | "approved" | "declined";
};

export interface MedicineTableProps {
  rows: MedicineRow[];
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
}

const currency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const pct = (x: number) => `${x.toFixed(0)}%`;

export function MedicineTable({ rows, onApprove, onDecline }: MedicineTableProps) {
  return (
    <Table className="bg-card rounded-lg border">
      <TableCaption className="text-xs">Review suggested substitutions and approve for savings.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Prescribed Medicine</TableHead>
          <TableHead>Generic Alternative</TableHead>
          <TableHead>Estimated Savings</TableHead>
          <TableHead className="text-right">Patient Approval</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => {
          const savings = Math.max(0, r.brandedPrice - r.genericPrice);
          const savingsPct = r.brandedPrice > 0 ? (savings / r.brandedPrice) * 100 : 0;
          const isFinal = r.approval !== "pending";
          return (
            <TableRow key={r.id} data-state={isFinal ? "selected" : undefined}>
              <TableCell>
                <div className="font-medium">{r.prescribedName}</div>
                <div className="text-xs text-muted-foreground">Branded Price {currency(r.brandedPrice)}</div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{r.genericName}</div>
                <div className="text-xs text-muted-foreground">Generic Price {currency(r.genericPrice)}</div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{currency(savings)}</div>
                <div className="text-xs text-muted-foreground">{pct(savingsPct)}</div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => onApprove(r.id)}
                    disabled={isFinal}
                    aria-label="Approve substitution"
                  >
                    <Check />
                    <span className="hidden md:inline">Approve</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDecline(r.id)}
                    disabled={isFinal}
                    aria-label="Decline substitution"
                  >
                    <X />
                    <span className="hidden md:inline">Decline</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
