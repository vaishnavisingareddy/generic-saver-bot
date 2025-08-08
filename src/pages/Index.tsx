import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MedicineTable, MedicineRow } from "@/components/medicine/MedicineTable";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";

const sampleRows: MedicineRow[] = [
  {
    id: "1",
    prescribedName: "Crestor 10mg (Rosuvastatin)",
    brandedPrice: 850,
    genericName: "Rosuvastatin 10mg",
    genericPrice: 120,
    approval: "pending",
  },
  {
    id: "2",
    prescribedName: "Nexium 40mg (Esomeprazole)",
    brandedPrice: 620,
    genericName: "Esomeprazole 40mg",
    genericPrice: 95,
    approval: "pending",
  },
  {
    id: "3",
    prescribedName: "Januvia 100mg (Sitagliptin)",
    brandedPrice: 4200,
    genericName: "Sitagliptin 100mg",
    genericPrice: 750,
    approval: "pending",
  },
];

const Index = () => {
  const [rows, setRows] = useState<MedicineRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const approved = rows.filter((r) => r.approval === "approved");

  const handleFile = (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    // Simulate extraction of medicines from prescription
    setRows(sampleRows);
    toast.success("Prescription processed", { description: "We found generic alternatives for your medicines." });
  };

  const onApprove = (id: string) => {
    setRows((rws) => rws.map((r) => (r.id === id ? { ...r, approval: "approved" } : r)));
    const med = rows.find((r) => r.id === id);
    if (med) toast.success("Substitution approved", { description: med.genericName });
  };

  const onDecline = (id: string) => {
    setRows((rws) => rws.map((r) => (r.id === id ? { ...r, approval: "declined" } : r)));
    const med = rows.find((r) => r.id === id);
    if (med) toast("Substitution declined", { description: med.prescribedName });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="container py-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Generic Medicine Substitution
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload your prescription (image or PDF). We’ll suggest high-quality generic equivalents, show your savings, and let you approve with one tap.
          </p>
        </div>
      </header>

      <main className="container space-y-8 pb-16">
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Upload prescription</CardTitle>
              <CardDescription>Supported formats: images and PDF</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFile(e.target.files?.[0])}
                aria-label="Upload prescription file"
              />
              <Button onClick={() => toast("Need help?", { description: "Choose an image or PDF to begin." })} className="sm:w-auto w-full">How it works</Button>
              {fileName && (
                <div className="text-sm text-muted-foreground truncate">Selected: {fileName}</div>
              )}
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="review-substitutions">
          <h2 id="review-substitutions" className="sr-only">Review substitutions</h2>
          {rows.length === 0 ? (
            <div className="rounded-lg border p-8 text-center text-muted-foreground">
              Your suggested substitutions will appear here after you upload a prescription.
            </div>
          ) : (
            <>
              <MedicineTable rows={rows} onApprove={onApprove} onDecline={onDecline} />
              <div className="mt-6 flex justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" disabled={approved.length === 0} aria-label="View approved list">
                      View approved list {approved.length > 0 ? `(${approved.length})` : ""}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Approved substitutions</DialogTitle>
                      <DialogDescription>These are the medicines you approved to substitute.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {approved.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No approved items yet.</p>
                      ) : (
                        <ul className="space-y-3">
                          {approved.map((m) => (
                            <li key={m.id} className="flex items-center justify-between rounded-md border p-3">
                              <div>
                                <div className="font-medium">{m.prescribedName}</div>
                                <div className="text-xs text-muted-foreground">→ {m.genericName}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm">Savings: ₹{Math.max(0, m.brandedPrice - m.genericPrice).toLocaleString("en-IN")}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="secondary">Close</Button>
                      </DialogClose>
                      {approved.length > 0 && (
                        <Button>Confirm and continue</Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
