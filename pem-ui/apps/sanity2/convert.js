import fs from 'fs';
import XLSX from 'xlsx';

// Read the Cucumber JSON report
const jsonData = JSON.parse(fs.readFileSync('test/report/cucumber_report.json', 'utf8'));

// Extract relevant data from the JSON report (customize this based on your requirements)
const features = jsonData.map(feature => ({
    name: feature.name,
    elements: feature.elements.map(scenario => ({
        name: scenario.name,
        status: scenario.steps.every(step => step.result.status === 'passed') ? 'passed' : 'failed'
    }))
}));

const featuresJson = jsonData.map(feature => {
    const data = {};
    feature.elements.forEach(scenario => {
        data.scenarioName = scenario.name;
        data.steps = "";
        scenario.steps.forEach(step => {
            if(!step.hidden) {
                data.steps+= step.keyword + step.name + "\n";
            }
        });
    })
    return data;
});

// Create a new workbook
const wb = XLSX.utils.book_new();

// Create a worksheet
const ws = XLSX.utils.json_to_sheet(featuresJson.flat());

/*features.forEach(feature => {
    XLSX.utils.book_append_sheet(wb, ws, feature.name);
});*/
// Add the worksheet to the workbook
XLSX.utils.book_append_sheet(wb, ws, 'Cucumber Report');

// Write the workbook to a file
XLSX.writeFile(wb, 'cucumber_report.xlsx');

console.log('Excel report generated successfully.');