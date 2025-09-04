import { CODCase } from '@/types/codda';

// Microsoft Graph API integration for Outlook and Teams
interface MSGraphConfig {
  clientId: string;
  tenantId: string;
  scopes: string[];
}

interface ReviewRequest {
  caseId: string;
  reviewers: string[];
  message?: string;
  dueDate?: string;
  priority: 'low' | 'normal' | 'high';
}

interface ExportOptions {
  format: 'pdf' | 'word' | 'markdown';
  includeSignatureBlock: boolean;
  autoRoute: boolean;
  reviewers?: string[];
  watermark?: string;
  officialFormat: boolean;
}

interface DigitalSignature {
  signerName: string;
  signerTitle: string;
  signerEmail: string;
  timestamp: string;
  certificateId?: string;
}

export class CODDAExportService {
  private msGraphConfig: MSGraphConfig;
  
  constructor(config: MSGraphConfig) {
    this.msGraphConfig = config;
  }

  // PDF Export with Digital Signature Support
  async exportToPDF(
    caseData: CODCase, 
    content: string, 
    options: ExportOptions,
    signature?: DigitalSignature
  ): Promise<Blob> {
    try {
      // Generate PDF using a PDF library (would use jsPDF or similar in production)
      const pdfDoc = await this.generatePDFDocument(caseData, content, options, signature);
      
      // If auto-routing is enabled, send for review
      if (options.autoRoute && options.reviewers) {
        await this.sendForReview({
          caseId: caseData.id,
          reviewers: options.reviewers,
          priority: 'normal'
        }, pdfDoc);
      }
      
      return pdfDoc;
    } catch (error) {
      console.error('PDF export failed:', error);
      throw new Error('Failed to export PDF document');
    }
  }

  // Word Document Export
  async exportToWord(
    caseData: CODCase, 
    content: string, 
    options: ExportOptions
  ): Promise<Blob> {
    try {
      // Generate Word document using docx library
      const wordDoc = await this.generateWordDocument(caseData, content, options);
      
      // Auto-route if enabled
      if (options.autoRoute && options.reviewers) {
        await this.sendForReview({
          caseId: caseData.id,
          reviewers: options.reviewers,
          priority: 'normal'
        }, wordDoc);
      }
      
      return wordDoc;
    } catch (error) {
      console.error('Word export failed:', error);
      throw new Error('Failed to export Word document');
    }
  }

  // Generate PDF Document
  private async generatePDFDocument(
    caseData: CODCase,
    content: string,
    options: ExportOptions,
    signature?: DigitalSignature
  ): Promise<Blob> {
    // Mock PDF generation - in production, would use jsPDF or similar
    const pdfContent = this.formatContentForPDF(caseData, content, signature);
    
    const mockPdfData = new TextEncoder().encode(`
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length ${pdfContent.length}
>>
stream
BT
/F1 12 Tf
72 720 Td
${pdfContent}
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
${300 + pdfContent.length}
%%EOF
    `);

    return new Blob([mockPdfData], { type: 'application/pdf' });
  }

  // Generate Word Document
  private async generateWordDocument(
    caseData: CODCase,
    content: string,
    options: ExportOptions
  ): Promise<Blob> {
    // Mock Word document generation
    const wordContent = this.formatContentForWord(caseData, content);
    
    // Simple Word document structure (in production, would use docx library)
    const mockWordData = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Title"/>
      </w:pPr>
      <w:r>
        <w:t>CHARACTER OF DISCHARGE DETERMINATION</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>Case ID: ${caseData.id}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>Claimant: ${caseData.claimant}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>File Number: ${caseData.fileNumber}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>${wordContent}</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>
    `;

    return new Blob([mockWordData], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
  }

  // Format content for PDF
  private formatContentForPDF(
    caseData: CODCase, 
    content: string, 
    signature?: DigitalSignature
  ): string {
    let formattedContent = `
DEPARTMENT OF VETERANS AFFAIRS
CHARACTER OF DISCHARGE DETERMINATION

Case ID: ${caseData.id}
Claimant: ${caseData.claimant}
File Number: ${caseData.fileNumber}
Station: ${caseData.station}
Date: ${new Date().toLocaleDateString()}

${content}
`;

    if (signature) {
      formattedContent += `

SIGNATURE BLOCK:
${signature.signerName}
${signature.signerTitle}
${signature.signerEmail}
Date: ${new Date(signature.timestamp).toLocaleDateString()}
`;
    }

    return formattedContent;
  }

  // Format content for Word
  private formatContentForWord(caseData: CODCase, content: string): string {
    return content
      .replace(/## (.+)/g, '$1') // Convert markdown headers
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold formatting
      .replace(/\*(.+?)\*/g, '$1') // Remove italic formatting
      .replace(/\n/g, '</w:t></w:r></w:p><w:p><w:r><w:t>'); // Convert line breaks
  }

  // Send document for review via Outlook
  async sendForReview(request: ReviewRequest, document?: Blob): Promise<void> {
    try {
      // Mock Microsoft Graph API call
      const emailData = {
        message: {
          subject: `CODDA Review Request - Case ${request.caseId}`,
          body: {
            contentType: 'HTML',
            content: this.generateReviewEmailBody(request)
          },
          toRecipients: request.reviewers.map(email => ({
            emailAddress: { address: email }
          })),
          attachments: document ? [{
            '@odata.type': '#microsoft.graph.fileAttachment',
            name: `COD-${request.caseId}-Draft.pdf`,
            contentBytes: await this.blobToBase64(document)
          }] : []
        }
      };

      // In production, would make actual Graph API call
      console.log('Sending email via Microsoft Graph:', emailData);
      
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create Teams notification
      await this.createTeamsNotification(request);
      
    } catch (error) {
      console.error('Failed to send review request:', error);
      throw new Error('Failed to send document for review');
    }
  }

  // Generate review email body
  private generateReviewEmailBody(request: ReviewRequest): string {
    return `
<html>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #0078d4, #106ebe); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
      <h2 style="margin: 0; font-size: 24px;">CODDA Review Request</h2>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Character of Discharge Determination Assistant</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #dee2e6;">
      <h3 style="color: #0078d4; margin-top: 0;">Review Details</h3>
      
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background: white;">
          <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold; width: 30%;">Case ID:</td>
          <td style="padding: 10px; border: 1px solid #dee2e6;">${request.caseId}</td>
        </tr>
        <tr style="background: #f8f9fa;">
          <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Priority:</td>
          <td style="padding: 10px; border: 1px solid #dee2e6;">
            <span style="background: ${request.priority === 'high' ? '#dc3545' : request.priority === 'normal' ? '#ffc107' : '#28a745'}; 
                         color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: uppercase;">
              ${request.priority}
            </span>
          </td>
        </tr>
        ${request.dueDate ? `
        <tr style="background: white;">
          <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Due Date:</td>
          <td style="padding: 10px; border: 1px solid #dee2e6;">${new Date(request.dueDate).toLocaleDateString()}</td>
        </tr>
        ` : ''}
      </table>
      
      ${request.message ? `
      <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #0078d4; margin: 15px 0;">
        <h4 style="margin: 0 0 10px 0; color: #0078d4;">Additional Notes:</h4>
        <p style="margin: 0;">${request.message}</p>
      </div>
      ` : ''}
      
      <div style="text-align: center; margin: 25px 0;">
        <a href="#" style="background: #0078d4; color: white; padding: 12px 24px; text-decoration: none; 
                           border-radius: 6px; font-weight: bold; display: inline-block;">
          Open in CODDA
        </a>
      </div>
      
      <div style="border-top: 1px solid #dee2e6; padding-top: 15px; margin-top: 20px; font-size: 12px; color: #6c757d;">
        <p style="margin: 0;">This is an automated message from the CODDA system. Please review the attached document and provide your feedback within the specified timeframe.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }

  // Create Teams notification
  private async createTeamsNotification(request: ReviewRequest): Promise<void> {
    try {
      // Mock Teams webhook notification
      const teamsMessage = {
        '@type': 'MessageCard',
        '@context': 'http://schema.org/extensions',
        themeColor: '0078D4',
        summary: `CODDA Review Request - Case ${request.caseId}`,
        sections: [{
          activityTitle: 'CODDA Review Request',
          activitySubtitle: `Case ${request.caseId}`,
          activityImage: 'https://example.com/codda-icon.png',
          facts: [
            { name: 'Case ID', value: request.caseId },
            { name: 'Priority', value: request.priority.toUpperCase() },
            { name: 'Reviewers', value: request.reviewers.length.toString() }
          ],
          markdown: true
        }],
        potentialAction: [{
          '@type': 'OpenUri',
          name: 'Open in CODDA',
          targets: [{
            os: 'default',
            uri: `https://henry-platform.va.gov/codda/case/${request.caseId}`
          }]
        }]
      };

      // In production, would post to Teams webhook
      console.log('Teams notification:', teamsMessage);
      
    } catch (error) {
      console.error('Failed to create Teams notification:', error);
    }
  }

  // Convert blob to base64 for email attachment
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Digital signature methods
  async addDigitalSignature(
    document: Blob,
    signature: DigitalSignature
  ): Promise<Blob> {
    // Mock digital signature addition
    // In production, would use a digital signature library
    console.log('Adding digital signature:', signature);
    
    // Return the document with signature metadata
    return document;
  }

  // Verify digital signature
  async verifySignature(document: Blob): Promise<boolean> {
    // Mock signature verification
    console.log('Verifying digital signature');
    return true;
  }

  // Get signature info from document
  async getSignatureInfo(document: Blob): Promise<DigitalSignature[]> {
    // Mock signature extraction
    return [{
      signerName: 'John Doe',
      signerTitle: 'VSR',
      signerEmail: 'john.doe@va.gov',
      timestamp: new Date().toISOString()
    }];
  }

  // Workflow automation
  async createApprovalWorkflow(
    caseId: string,
    approvers: string[],
    deadlineHours: number = 72
  ): Promise<string> {
    // Mock workflow creation
    const workflowId = `workflow-${caseId}-${Date.now()}`;
    
    console.log('Creating approval workflow:', {
      workflowId,
      caseId,
      approvers,
      deadline: new Date(Date.now() + deadlineHours * 60 * 60 * 1000)
    });
    
    return workflowId;
  }

  // Track workflow status
  async getWorkflowStatus(workflowId: string): Promise<{
    status: 'pending' | 'in-progress' | 'approved' | 'rejected';
    completedSteps: number;
    totalSteps: number;
    nextApprover?: string;
  }> {
    // Mock workflow status
    return {
      status: 'in-progress',
      completedSteps: 1,
      totalSteps: 3,
      nextApprover: 'sarah.johnson@va.gov'
    };
  }
}

// Export utility functions
export const createExportService = (config: MSGraphConfig) => {
  return new CODDAExportService(config);
};

export const defaultMSGraphConfig: MSGraphConfig = {
  clientId: process.env.NEXT_PUBLIC_MS_GRAPH_CLIENT_ID || 'mock-client-id',
  tenantId: process.env.NEXT_PUBLIC_MS_TENANT_ID || 'mock-tenant-id',
  scopes: [
    'https://graph.microsoft.com/Mail.Send',
    'https://graph.microsoft.com/Files.ReadWrite',
    'https://graph.microsoft.com/User.Read'
  ]
};

// Mock data for development
export const mockReviewers = [
  { id: 'rvsr-1', name: 'Sarah Johnson', email: 'sarah.johnson@va.gov', role: 'RVSR' },
  { id: 'dro-1', name: 'Michael Chen', email: 'michael.chen@va.gov', role: 'DRO' },
  { id: 'coach-1', name: 'Dr. Emily Rodriguez', email: 'emily.rodriguez@va.gov', role: 'Coach/QA' },
  { id: 'medical-1', name: 'Dr. James Wilson', email: 'james.wilson@va.gov', role: 'Medical Reviewer' }
];
