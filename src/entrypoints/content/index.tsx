import "~/assets/tailwind.css";
import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App";
import { PortalContext } from "@/hooks/PortalContext";

export default defineContentScript({
  matches: ["*://*.xero.com/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "xero-automation-ui",
      position: "inline",
      anchor:
        "#report-settings > div > div > div.xui-u-flex.xui-u-flex-justify-end.xui-margin-left-auto.xui-column-3-of-12",

      onMount: (container, shadow) => {
        const app = document.createElement("div");
        app.id = "dialog-root";
        container.append(app);

        const root = ReactDOM.createRoot(app);
        root.render(<ContentRoot />);
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });

    ui.autoMount();
  },
});

const ContentRoot = () => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  return (
    <React.StrictMode>
      <PortalContext.Provider value={portalContainer}>
        <div ref={setPortalContainer} id="dialog-portal-container">
          <App />
        </div>
      </PortalContext.Provider>
    </React.StrictMode>
  );
};
