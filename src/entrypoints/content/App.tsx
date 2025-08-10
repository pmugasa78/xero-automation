import { getTargetUrl, groupByName, waitForElement } from "@/lib/utils";
import { useEffect } from "react";

import CompanySelector from "@/components/company-selector";

const App = () => {
  const [trackingCategories, setTrackingCategories] = useState({});

  useEffect(() => {
    async function getTrackingCategories() {
      try {
        const currentUrl = window.location.href;
        const targetUrl = getTargetUrl(currentUrl);
        const response = await fetch(targetUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Filter to only get Qualifying Company tracking category
        const filteredCategoriesObj = data.trackingCategories.filter(
          (t: any) => t.Name === "Qualifying Company"
        )[0].Items;

        // Convert the object to an array
        const filteredCategoriesArr = Object.values(filteredCategoriesObj);

        // Group tracking categories by name
        const grouped = groupByName(filteredCategoriesArr);

        setTrackingCategories(grouped);
      } catch (err) {
        console.error("Content script fetch failed:", err);
      }
    }

    getTrackingCategories();
  }, []);

  return (
    <div className="ml-3 z-[999]">
      <CompanySelector rawCompaniesData={trackingCategories} />
    </div>
  );
};

export default App;
