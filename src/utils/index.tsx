export const handleDownloadQRCode = async (svgDataUrl: string, fileName: string) => { 
  // Show a confirmation popup before initiating the download
  if (window.confirm("Do you want to download the QR code?")) {
    try {
      let svgData;

      if (svgDataUrl.startsWith('data:image/svg+xml')) {
        // Decode the SVG data from the data URL
        const encodedData = svgDataUrl.split(',')[1];
        svgData = decodeURIComponent(encodedData);
      } else {
        // Fetch SVG data from the provided URL
        svgData = await (await fetch(svgDataUrl)).text();
      }

      // Create a Blob from the SVG data
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });

      // Create a temporary link for downloading
      const url = window.URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = fileName;

      // Simulate a click on the link to initiate the download
      downloadLink.click();

      // Clean up the temporary link and object URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error during download:", error);
      // Handle any errors that occurred during the download process
    }
  }
};
