import { useState } from "react";
import { Search, FolderDown, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { delay, waitForElement } from "@/lib/utils";

interface Company {
  id: string;
  name: string;
  investors: string[];
  isActive: boolean;
}

// Corrected: Export as default function
export default function CompanySelector({ rawCompaniesData }: any) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Transform the raw data into a flat array suitable for the component
  const companies: Company[] = Object.entries(rawCompaniesData)
    .map(([id, subEntities]: any) => {
      const investors = subEntities.map((entity: any) => {
        // Remove the ID prefix from the name if it exists for cleaner display
        const prefix = `${id} - `;
        if (entity.Name.startsWith(prefix)) {
          return entity.Name.substring(prefix.length);
        }
        return entity.Name;
      });
      // A company is considered active if at least one of its associated entities is active
      const isActive = subEntities.some((entity: any) => entity.IsActive);

      return {
        id,
        name: id,
        investors,
        isActive,
      };
    })
    .filter((company) => company.isActive); // Filter out companies that are not active.

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.investors.some((subName) =>
        subName.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleCompanyToggle = (companyId: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCompanies.length === filteredCompanies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(filteredCompanies.map((company) => company.id));
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedCompanies.length === 0) return;
      setIsProcessing(true);
      setOpen(false);

      for (const company of selectedCompanies) {
        // 1. Click filter button
        const filterBtn = (await waitForElement(
          "button.xui-button.report-settings-filter-button"
        )) as HTMLElement;
        if (filterBtn) {
          filterBtn.click();
          //await delay(300); // Wait for modal to open
        }

        // 2. Clear filter button
        const clearFilterButton = (await waitForElement(
          'button[aria-label="Clear"]'
        )) as HTMLElement;
        if (clearFilterButton) {
          clearFilterButton.click();
          await delay(300); // Wait for filter list to refresh
        }

        // 3. Expand accordion
        const accordionTrigger = (await waitForElement(
          ".xui-accordiontrigger"
        )) as HTMLElement;
        if (accordionTrigger) {
          accordionTrigger.click();
        }

        // 4. Check checkbox matching qc.name
        const labels = document.querySelectorAll(
          "label.xui-styledcheckboxradio"
        );
        for (const label of labels) {
          const textSpan = label.querySelector("span.list-filter-option-label");
          if (textSpan?.textContent?.includes(company)) {
            const checkbox = label.querySelector(
              'input[type="checkbox"]'
            ) as HTMLInputElement;
            if (checkbox && !checkbox.checked) {
              checkbox.click();
            }
          }
        }

        // 5. Click Apply Filter
        const applyButton = (await waitForElement(
          'button[data-automationid="report-settings-filter-modal-apply-button"]'
        )) as HTMLElement;
        if (applyButton) {
          applyButton.click();
          await delay(1000);
        }

        // 6. Click Update
        const updateButton = (await waitForElement(
          '[data-automationid="settings-panel-update-button"]'
        )) as HTMLElement;
        if (updateButton) {
          updateButton.click();
          await delay(5000); // Wait for update to complete
        }

        // 7. Click Export
        const exportButton = (await waitForElement(
          '[data-automationid="report-toolbar-export-button"]'
        )) as HTMLElement;
        if (exportButton) {
          exportButton.click();
          await delay(500); // Wait for export menu
        }

        // 8. Click Excel export
        const exportExcelButton = Array.from(
          document.querySelectorAll("button.xui-pickitem--body")
        ).find((btn) => btn?.textContent?.trim() === "Excel") as
          | HTMLElement
          | undefined;

        if (exportExcelButton) {
          exportExcelButton.click();
          console.log("Clicked Excel export for:", company);
          await delay(500); // Wait for download
        } else {
          console.error("Export Excel button not found for:", company);
        }

        // 9. Notify background for file rename

        // Get report name
        const heading = document.querySelector(
          'h1.xui-pageheading--title[data-automationid="report-page-header--title"]'
        );
        const reportTitle = heading ? heading?.textContent?.trim() : null;

        browser.runtime.sendMessage({
          action: "setDownloadName",
          name: company,
          reportTitle,
        });
      }
    } catch (e) {
      console.error("Exception: ", e);
      alert("🛑 An unexpected error has occured. Please try again");
    } finally {
      // Reset after completion
      setIsProcessing(false);
      setSelectedCompanies([]);
      setOpen(false);
    }
  };

  function hideReportDisplay() {
    const element = document.querySelector(
      '[data-automationid="report-page"]'
    ) as HTMLElement;
    if (element) {
      element.style.display = "none";
      console.log("Report page container has been hidden.");
    } else {
      console.log("Report page container not found.");
    }
  }

  function openDialog() {
    setOpen(true);
    hideReportDisplay();
    console.log("After hide");
  }
  return (
    <div className="">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={openDialog}
            disabled={isProcessing}
            size="icon"
            className=" size-10 rounded hover:cursor-pointer bg-teal-600 hover:bg-teal-900 "
          >
            {isProcessing ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <FolderDown />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Download Reports</DialogTitle>
            <DialogDescription>
              Choose the companies you want to download. Use the search to find
              specific companies.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                disabled={isProcessing}
              />
            </div>

            {/* Select All Button */}
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">
                {selectedCompanies.length} of {filteredCompanies.length}{" "}
                selected
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={isProcessing}
              >
                {selectedCompanies.length === filteredCompanies.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>

            {/* Companies List */}
            <ScrollArea className="h-64 rounded-md border p-2">
              <div className="space-y-2">
                {filteredCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center space-x-2 rounded-lg p-2 hover:bg-muted"
                  >
                    <Checkbox
                      id={company.id}
                      checked={selectedCompanies.includes(company.id)}
                      onCheckedChange={() => handleCompanyToggle(company.id)}
                      disabled={isProcessing}
                    />
                    <div className="flex-1 space-y-1">
                      <Label
                        htmlFor={company.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {company.name}
                      </Label>

                      {company.investors.map((investor) => (
                        <p
                          key={investor}
                          className="text-xs text-muted-foreground"
                        >
                          {investor}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
                {filteredCompanies.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    No companies found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              className="hover:cursor-pointer bg-teal-600 hover:bg-teal-900"
              onClick={handleSubmit}
              disabled={selectedCompanies.length === 0 || isProcessing}
            >
              {isProcessing
                ? "Downloading..."
                : `Download ${selectedCompanies.length} Reports`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
