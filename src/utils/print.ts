import type { FormData } from '../types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

// Utility function to parse date in either YYYY-MM-DD, DD/MM/YYYY, or ISO format
const parseDateString = (dateString: string): dayjs.Dayjs | null => {
  if (!dateString) return null;
  // Try ISO format first (for createdAt/updatedAt fields)
  if (dayjs(dateString).isValid() && dateString.includes('T')) {
    return dayjs(dateString);
  }
  // Try DD/MM/YYYY first (new format)
  if (dayjs(dateString, 'DD/MM/YYYY', true).isValid()) {
    return dayjs(dateString, 'DD/MM/YYYY');
  }
  // Fall back to YYYY-MM-DD (old format for existing data)
  if (dayjs(dateString, 'YYYY-MM-DD', true).isValid()) {
    return dayjs(dateString, 'YYYY-MM-DD');
  }
  // Try default parsing
  return dayjs(dateString);
};

export const printSubmission = (submission: FormData): void => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print the form');
    return;
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    const parsed = parseDateString(dateString);
    if (!parsed) return 'Invalid Date';
    return parsed.format('DD/MM/YYYY');
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Form Submission - ${submission.personalInfo.firstName} ${submission.personalInfo.lastName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #fff;
          padding: 40px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #1976d2;
        }
        
        .header h1 {
          color: #1976d2;
          font-size: 28px;
          margin-bottom: 10px;
        }
        
        .header p {
          color: #666;
          font-size: 14px;
        }
        
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        
        .section-title {
          background: #f5f5f5;
          color: #1976d2;
          padding: 12px 16px;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          border-left: 4px solid #1976d2;
        }
        
        .field-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        
        .field {
          padding: 10px;
          background: #fafafa;
          border-radius: 4px;
        }
        
        .field-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        
        .field-value {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }
        
        .job-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          background: #fafafa;
        }
        
        .job-header {
          font-weight: 600;
          color: #1976d2;
          margin-bottom: 10px;
          font-size: 16px;
        }
        
        .full-width {
          grid-column: 1 / -1;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
        
        @media print {
          body {
            padding: 20px;
          }
          
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Form Submission Details</h1>
        <p>ID: ${submission.id || 'N/A'} | Created: ${submission.createdAt ? formatDate(submission.createdAt) : 'N/A'}</p>
      </div>

      <!-- Personal Information -->
      <div class="section">
        <div class="section-title">Personal Information</div>
        <div class="field-grid">
          <div class="field">
            <div class="field-label">First Name</div>
            <div class="field-value">${submission.personalInfo.firstName || 'N/A'}</div>
          </div>
          <div class="field">
            <div class="field-label">Last Name</div>
            <div class="field-value">${submission.personalInfo.lastName || 'N/A'}</div>
          </div>
          <div class="field">
            <div class="field-label">Middle Name</div>
            <div class="field-value">${submission.personalInfo.middleName || 'N/A'}</div>
          </div>
          <div class="field">
            <div class="field-label">Phone Number</div>
            <div class="field-value">${submission.personalInfo.countryCode} ${submission.personalInfo.phoneNumber || 'N/A'}</div>
          </div>
          <div class="field">
            <div class="field-label">Email Address</div>
            <div class="field-value">${submission.personalInfo.email || 'N/A'}</div>
          </div>
          <div class="field">
            <div class="field-label">Date of Birth</div>
            <div class="field-value">${formatDate(submission.personalInfo.dateOfBirth)}</div>
          </div>
        </div>
      </div>

      <!-- Education Details -->
      <div class="section">
        <div class="section-title">Education Details</div>
        
        <div style="margin-bottom: 20px;">
          <div style="font-weight: 600; color: #666; margin-bottom: 10px;">10th Standard</div>
          <div class="field-grid">
            <div class="field">
              <div class="field-label">Pass Year</div>
              <div class="field-value">${submission.educationInfo.tenth.passYear || 'N/A'}</div>
            </div>
            <div class="field">
              <div class="field-label">Board</div>
              <div class="field-value">${submission.educationInfo.tenth.board || 'N/A'}</div>
            </div>
          </div>
        </div>

        ${submission.educationInfo.educationType === '12th' ? `
        <div style="margin-bottom: 20px;">
          <div style="font-weight: 600; color: #666; margin-bottom: 10px;">12th Standard</div>
          <div class="field-grid">
            <div class="field">
              <div class="field-label">Pass Year</div>
              <div class="field-value">${submission.educationInfo.twelfth.passYear || 'N/A'}</div>
            </div>
            <div class="field">
              <div class="field-label">Board</div>
              <div class="field-value">${submission.educationInfo.twelfth.board || 'N/A'}</div>
            </div>
          </div>
        </div>
        ` : `
        <div style="margin-bottom: 20px;">
          <div style="font-weight: 600; color: #666; margin-bottom: 10px;">Diploma</div>
          <div class="field-grid">
            <div class="field">
              <div class="field-label">Passing Year</div>
              <div class="field-value">${submission.educationInfo.diploma.passYear || 'N/A'}</div>
            </div>
            <div class="field">
              <div class="field-label">Organization</div>
              <div class="field-value">${submission.educationInfo.diploma.organization || 'N/A'}</div>
            </div>
            <div class="field">
              <div class="field-label">Major</div>
              <div class="field-value">${submission.educationInfo.diploma.major || 'N/A'}</div>
            </div>
          </div>
        </div>
        `}

        <div>
          <div style="font-weight: 600; color: #666; margin-bottom: 10px;">Graduation</div>
          <div class="field-grid">
            <div class="field">
              <div class="field-label">Completion Year</div>
              <div class="field-value">${submission.educationInfo.graduation.completionYear || 'N/A'}</div>
            </div>
            <div class="field">
              <div class="field-label">Organization/University</div>
              <div class="field-value">${submission.educationInfo.graduation.organization || 'N/A'}</div>
            </div>
            <div class="field">
              <div class="field-label">Degree</div>
              <div class="field-value">${submission.educationInfo.graduation.degree || 'N/A'}</div>
            </div>
            <div class="field">
              <div class="field-label">Major/Specialization</div>
              <div class="field-value">${submission.educationInfo.graduation.major || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Work Experience -->
      <div class="section">
        <div class="section-title">Work Experience</div>
        
        <div class="field-grid" style="margin-bottom: 20px;">
          <div class="field">
            <div class="field-label">Total Experience</div>
            <div class="field-value">${submission.workExperience.totalExperience || '0'} Years</div>
          </div>
          <div class="field">
            <div class="field-label">Current CTC</div>
            <div class="field-value">${submission.workExperience.currentCTC || 'N/A'} LPA</div>
          </div>
          <div class="field">
            <div class="field-label">Expected CTC</div>
            <div class="field-value">${submission.workExperience.expectedCTC || 'N/A'} LPA</div>
          </div>
          <div class="field">
            <div class="field-label">Available From</div>
            <div class="field-value">${formatDate(submission.workExperience.availableFrom)}</div>
          </div>
        </div>

        ${submission.workExperience.jobs.length > 0 ? `
        <div style="font-weight: 600; color: #666; margin-bottom: 15px;">Job/Internship Details</div>
        ${submission.workExperience.jobs.map((job, index) => `
        <div class="job-card">
          <div class="job-header">Job #${index + 1} - ${job.designation || 'N/A'}</div>
          <div class="field-grid">
            <div class="field">
              <div class="field-label">Type</div>
              <div class="field-value">${job.type || 'N/A'}</div>
            </div>
            <div class="field">
              <div class="field-label">Duration</div>
              <div class="field-value">${formatDate(job.startDate)} - ${formatDate(job.endDate)}</div>
            </div>
            <div class="field full-width">
              <div class="field-label">Description</div>
              <div class="field-value">${job.description || 'N/A'}</div>
            </div>
          </div>
        </div>
        `).join('')}
        ` : '<p style="color: #999; font-style: italic;">No job entries provided</p>'}
      </div>

      <div class="footer">
        <p>Generated on ${new Date().toLocaleString()}</p>
      </div>

      <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print()" style="padding: 12px 24px; font-size: 16px; cursor: pointer; background: #1976d2; color: white; border: none; border-radius: 4px;">
          Print / Save as PDF
        </button>
      </div>

      <script>
        // Auto-trigger print dialog after a short delay to ensure content is loaded
        setTimeout(() => {
          window.print();
        }, 500);
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
