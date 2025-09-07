import React from "react";

const AdSense = ({
  adSlot,
  adFormat = "auto",
  className = "",
  style = {},
  fullWidthResponsive = true,
}) => {
  React.useEffect(() => {
    try {
      // Push the ad to Google AdSense
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9441277012043156"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
};

export default AdSense;
