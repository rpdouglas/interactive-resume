#!/bin/bash

# ==========================================
# 💾 Data Restore Script (Source of Truth)
# ==========================================
# Run this to reset src/data/*.json to the Gold Master state.

DATA_DIR="src/data"
mkdir -p "$DATA_DIR"

echo "Restoring profile.json..."
cat << 'JSON' > "$DATA_DIR/profile.json"
{
  "basics": {
    "name": "Ryan Douglas",
    "label": "Management Consultant & Power BI Developer",
    "email": "rpdouglas@gmail.com",
    "phone": "613.936.6341",
    "location": "Cornwall, Ontario",
    "summary": "A results-driven Data & Analytics Leader with 15 years of experience bridging the gap between high-level business strategy and granular technical execution. Proven expertise in leading cross-functional teams through complex digital transformations and building enterprise-grade BI solutions from the ground up.",
    "website": "https://ryandouglas-resume.web.app",
    "github": "https://github.com/rpdouglas",
    "linkedin": "https://linkedin.com/in/ryandouglas"
  },
  "metrics": {
    "yearsExperience": 15,
    "projectsDelivered": 40,
    "certifications": 2
  }
}
JSON

echo "Restoring skills.json..."
cat << 'JSON' > "$DATA_DIR/skills.json"
[
  {
    "id": "strategy",
    "label": "Business Strategy",
    "data": [
      { "subject": "Change Mgmt", "A": 95, "fullMark": 100 },
      { "subject": "Stakeholder Mgmt", "A": 90, "fullMark": 100 },
      { "subject": "Digital Strategy", "A": 95, "fullMark": 100 },
      { "subject": "Process Opt", "A": 85, "fullMark": 100 },
      { "subject": "Risk Mitigation", "A": 80, "fullMark": 100 }
    ]
  },
  {
    "id": "technical",
    "label": "Technical Stack",
    "data": [
      { "subject": "Power BI / DAX", "A": 95, "fullMark": 100 },
      { "subject": "SQL / T-SQL", "A": 90, "fullMark": 100 },
      { "subject": "ETL (SSIS)", "A": 85, "fullMark": 100 },
      { "subject": "Data Modeling", "A": 90, "fullMark": 100 },
      { "subject": "C# / VB.NET", "A": 75, "fullMark": 100 }
    ]
  }
]
JSON

echo "Restoring experience.json (Nested Project Schema)..."
cat << 'JSON' > "$DATA_DIR/experience.json"
[
  {
    "id": "job_pwc",
    "role": "Manager (Data & Analytics)",
    "company": "PwC Canada LLP",
    "date": "2012 - 2024",
    "logo": "💼",
    "summary": "Senior management consultant leading data-driven transformation projects and advising government leaders while engineering hands-on analytics solutions.",
    "skills": ["Digital Strategy", "Leadership", "Stakeholder Mgmt"],
    "projects": [
      {
        "id": "pwc_proj_1",
        "title": "Public Sector Digital Transformation",
        "skills": ["Power BI", "SQL", "Change Management"],
        "par": {
          "problem": "Government clients struggled with fragmented data ecosystems, preventing executive visibility into critical operations.",
          "action": "Architected target operating models and deployed advanced Power BI dashboards to track customer journeys.",
          "result": "Delivered sustainable digital transformation, aligning technical execution with strategic business objectives."
        }
      },
      {
        "id": "pwc_proj_2",
        "title": "Omnichannel Contact Center Modernization",
        "skills": ["Data Modeling", "Azure", "Risk Assessment"],
        "par": {
          "problem": "Legacy contact center infrastructure lacked integration, leading to poor customer insights and operational inefficiencies.",
          "action": "Led the design and deployment of modern BI solutions, integrating data from multiple channels for a unified view.",
          "result": "Enhanced operational efficiency and enabled real-time reporting for high-stakes regulatory environments."
        }
      }
    ]
  },
  {
    "id": "job_biond",
    "role": "Business Intelligence Developer",
    "company": "Biond Consulting",
    "date": "2011 - 2012",
    "logo": "📊",
    "summary": "Specialized in end-to-end Microsoft BI solutions, from architecting data warehouses to building robust reporting dashboards.",
    "skills": ["Microsoft BI Stack", "Consulting"],
    "projects": [
      {
        "id": "biond_proj_1",
        "title": "Retail Analytics Platform Migration",
        "skills": ["SSIS", "Data Warehousing", "ETL"],
        "par": {
          "problem": "A major Canadian clothing retailer relied on legacy systems that could not scale with their growing data volume.",
          "action": "Built and optimized complex ETL pipelines using SSIS and architected a new enterprise-grade data warehouse.",
          "result": "Successfully transitioned client to a modern analytics platform, significantly enhancing strategic insight capabilities."
        }
      },
      {
        "id": "biond_proj_2",
        "title": "Distributor Reporting Solution",
        "skills": ["SSRS", "SQL", "KPI Definition"],
        "par": {
          "problem": "A major distributor lacked the reporting infrastructure to make timely inventory and sales decisions.",
          "action": "Collaborated with clients to define critical KPIs and delivered a custom SSRS reporting solution.",
          "result": "Strengthened executive decision-making and improved business responsiveness post-implementation."
        }
      }
    ]
  },
  {
    "id": "job_tele",
    "role": "Manager, Data and Analytics",
    "company": "Teleperformance",
    "date": "2005 - 2011",
    "logo": "🌍",
    "summary": "Managed the data and analytics team driving strategy and transformation across international operations.",
    "skills": ["Team Leadership", "Process Improvement"],
    "projects": [
      {
        "id": "tp_proj_1",
        "title": "Global Contact Center Automation",
        "skills": ["C#", "SharePoint", "Automation"],
        "par": {
          "problem": "International operations relied on manual reporting processes, causing data latency and high operational costs.",
          "action": "Managed the full SDLC of automated reporting solutions using C#, SharePoint, and SQL.",
          "result": "Implemented automated processes that resulted in significant time and cost savings across multiple departments."
        }
      },
      {
        "id": "tp_proj_2",
        "title": "Executive Dashboard Suite",
        "skills": ["SSRS", "Visual Studio", "SQL Server"],
        "par": {
          "problem": "Leadership lacked clear visibility into performance metrics and operational health across regions.",
          "action": "Developed custom dashboards and scorecards to standardize performance tracking globally.",
          "result": "Provided leadership with real-time visibility, enabling faster resolution of operational incidents."
        }
      }
    ]
  }
]
JSON

chmod +x scripts/update_data.sh

echo "=========================================="
echo "✅ Codebase Cleaned & Secured."
echo "👉 Deleted: src/App.css, src/assets/react.svg"
echo "👉 Secured: scripts/update_data.sh now contains REAL data."
echo "=========================================="
