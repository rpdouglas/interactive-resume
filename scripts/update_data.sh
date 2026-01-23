#!/bin/bash

# ==========================================
# 💾 Interactive Resume: Data Layer Setup
# ==========================================
# Description: Populates src/data with JSON files for Profile, Skills, and Experience.

DATA_DIR="src/data"

echo "📂 Ensuring $DATA_DIR exists..."
mkdir -p "$DATA_DIR"

# ------------------------------------------
# 1. PROFILE.JSON
# ------------------------------------------
echo "writing $DATA_DIR/profile.json..."
cat << 'EOF' > "$DATA_DIR/profile.json"
{
  "basics": {
    "name": "Your Name",
    "label": "Management Consultant & Power BI Developer",
    "email": "your.email@example.com",
    "phone": "(555) 555-5555",
    "location": "Cornwall, Ontario",
    "summary": "A results-driven Management Consultant with 15 years of experience leading complex business transformation projects. Certified Microsoft Power BI Developer specializing in bridging the gap between strategic business goals and technical data implementations.",
    "website": "https://yourwebsite.com",
    "github": "https://github.com/yourusername",
    "linkedin": "https://linkedin.com/in/yourusername"
  },
  "metrics": {
    "yearsExperience": 15,
    "projectsDelivered": 45,
    "certifications": 2
  }
}
EOF

# ------------------------------------------
# 2. SKILLS.JSON
# ------------------------------------------
echo "writing $DATA_DIR/skills.json..."
cat << 'EOF' > "$DATA_DIR/skills.json"
[
  {
    "id": "strategy",
    "label": "Business Strategy",
    "data": [
      { "subject": "Change Mgmt", "A": 95, "fullMark": 100 },
      { "subject": "Stakeholder Analysis", "A": 90, "fullMark": 100 },
      { "subject": "Process Optimization", "A": 85, "fullMark": 100 },
      { "subject": "System Implementation", "A": 90, "fullMark": 100 },
      { "subject": "TOWS Analysis", "A": 80, "fullMark": 100 }
    ]
  },
  {
    "id": "technical",
    "label": "Technical Stack",
    "data": [
      { "subject": "Power BI", "A": 95, "fullMark": 100 },
      { "subject": "DAX / SQL", "A": 85, "fullMark": 100 },
      { "subject": "React / JS", "A": 75, "fullMark": 100 },
      { "subject": "Zoho Analytics", "A": 80, "fullMark": 100 },
      { "subject": "Data Modeling", "A": 90, "fullMark": 100 }
    ]
  }
]
EOF

# ------------------------------------------
# 3. EXPERIENCE.JSON
# ------------------------------------------
echo "writing $DATA_DIR/experience.json..."
cat << 'EOF' > "$DATA_DIR/experience.json"
[
  {
    "id": "exp-1",
    "role": "Senior Management Consultant",
    "company": "Consulting Firm",
    "period": "2015 - Present",
    "type": "work",
    "skills": ["Business Transformation", "System Implementation", "Change Mgmt"],
    "par": {
      "problem": "Large-scale organizations struggling with inefficient legacy systems and undefined business processes.",
      "action": "Led complex business transformation initiatives, implementing new system architectures and managing stakeholder expectations across multiple departments.",
      "result": "Delivered sustainable operational improvements and successful system migrations for high-value clients."
    }
  },
  {
    "id": "exp-2",
    "role": "Power BI Developer",
    "company": "Freelance / Contract",
    "period": "2022 - Present",
    "type": "work",
    "skills": ["Power BI", "DAX", "Data Visualization"],
    "par": {
      "problem": "Clients possessed vast amounts of data but lacked actionable insights due to poor reporting infrastructure.",
      "action": "Designed and deployed interactive Power BI dashboards, utilizing advanced DAX formulas to calculate custom KPIs.",
      "result": "Enabled data-driven decision-making, reducing reporting time by 40% and identifying key revenue drivers."
    }
  },
  {
    "id": "edu-1",
    "role": "Computer Programmer Graduate",
    "company": "Fanshawe College",
    "period": "2001 - 2003",
    "type": "education",
    "skills": ["Software Development", "Logic", "Foundations"],
    "par": {
      "problem": "N/A",
      "action": "Completed rigorous coursework in computer programming, algorithms, and database management.",
      "result": "Graduated with strong foundational knowledge that bridges the gap between modern consulting and technical execution."
    }
  }
]
EOF

echo "✅ Data Layer Updated Successfully!"