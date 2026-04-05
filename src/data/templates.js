/**
 * Sample legal templates with placeholder fields.
 * In production these are stored in the database and can be
 * created/edited by Admins via the Templates Management page.
 */
export const SAMPLE_TEMPLATES = [
    {
        id: 'tpl_nda',
        name: 'Non-Disclosure Agreement (NDA)',
        category: 'Contract',
        description: 'Mutual or one-way confidentiality agreement between parties.',
        icon: 'lock',
        fields: [
            { key: 'clientName', label: 'Disclosing Party Name', type: 'text', required: true },
            { key: 'recipientName', label: 'Receiving Party Name', type: 'text', required: true },
            { key: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
            { key: 'jurisdiction', label: 'Liberian County (e.g. Montserrado)', type: 'text', required: true },
            { key: 'duration', label: 'Duration (years)', type: 'number', required: true },
            { key: 'purposeDescription', label: 'Purpose of Disclosure', type: 'textarea', required: true },
        ],
        content: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of [effectiveDate] ("Effective Date") by and between:

[clientName] ("Disclosing Party")
and
[recipientName] ("Receiving Party")

collectively referred to as the "Parties."

1. PURPOSE
The Parties wish to explore a potential business relationship in connection with [purposeDescription] (the "Purpose"). In connection with the Purpose, each Party may disclose to the other certain confidential and proprietary information.

2. CONFIDENTIAL INFORMATION
"Confidential Information" means any and all non-public information, including but not limited to technical data, trade secrets, research, product plans, products, services, customers, suppliers, markets, software, inventions, processes, designs, drawings, engineering, hardware configuration information, marketing, finances or other business information.

3. OBLIGATIONS
The Receiving Party agrees to:
(a) Hold the Confidential Information in strict confidence;
(b) Not to disclose such information to any third party without prior written consent;
(c) Use the Confidential Information solely for the Purpose stated above;
(d) Protect the Confidential Information with at least the same degree of care used to protect its own confidential information, but no less than reasonable care.

4. TERM
This Agreement shall remain in effect for a period of [duration] years from the Effective Date.

5. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the Republic of Liberia and specifically under the jurisdiction of the courts in [jurisdiction] County.

6. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the Parties with respect to the subject matter hereof.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.

________________________              ________________________
[clientName]                          [recipientName]
Disclosing Party                      Receiving Party
Date: _______________                 Date: _______________`,
        createdAt: '2024-01-10T09:00:00Z',
        usageCount: 47,
        estimatedTime: '< 1 min',
    },
    {
        id: 'tpl_service',
        name: 'Service Agreement',
        category: 'Contract',
        description: 'Professional services contract between provider and client.',
        icon: 'clipboard',
        fields: [
            { key: 'clientName', label: 'Client Name', type: 'text', required: true },
            { key: 'providerName', label: 'Service Provider Name', type: 'text', required: true },
            { key: 'serviceDescription', label: 'Service Description', type: 'textarea', required: true },
            { key: 'startDate', label: 'Start Date', type: 'date', required: true },
            { key: 'endDate', label: 'End Date', type: 'date', required: false },
            { key: 'paymentAmount', label: 'Payment Amount ($)', type: 'text', required: true },
            { key: 'paymentSchedule', label: 'Payment Schedule', type: 'select', options: ['Monthly', 'Bi-weekly', 'Upon completion', 'Milestone-based'], required: true },
            { key: 'jurisdiction', label: 'County in Liberia', type: 'text', required: true },
        ],
        content: `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into as of [startDate], between:

[clientName] ("Client")
and
[providerName] ("Service Provider")

1. SERVICES
Service Provider agrees to perform the following services for Client:
[serviceDescription]

2. COMPENSATION
Client agrees to pay Service Provider $[paymentAmount] on a [paymentSchedule] basis. Payment shall be made within 15 days of invoice date.

3. TERM
This Agreement shall commence on [startDate] and continue until [endDate], unless earlier terminated.

4. INDEPENDENT CONTRACTOR
Service Provider is an independent contractor and not an employee of Client. Service Provider shall be responsible for all taxes on amounts earned under this Agreement.

5. CONFIDENTIALITY
Service Provider agrees to maintain in confidence all Client information and not to disclose or use such information except as necessary to perform the Services.

6. INTELLECTUAL PROPERTY
All work product created by Service Provider in connection with the Services shall be considered work-for-hire and shall be the sole property of Client upon full payment.

7. TERMINATION
Either party may terminate this Agreement upon 30 days written notice. Client shall pay for all services rendered through the termination date.

8. GOVERNING LAW
This Agreement is governed by the laws of the Republic of Liberia and the local laws of [jurisdiction] County.

________________________              ________________________
[clientName]                          [providerName]
Client                                Service Provider
Date: _______________                 Date: _______________`,
        createdAt: '2024-01-15T10:00:00Z',
        usageCount: 82,
        estimatedTime: '< 2 min',
    },
    {
        id: 'tpl_affidavit',
        name: 'General Affidavit',
        category: 'Affidavit',
        description: 'Sworn statement of facts for court or official use.',
        icon: 'scale',
        fields: [
            { key: 'affiantName', label: 'Affiant Full Name', type: 'text', required: true },
            { key: 'affiantAddress', label: 'Affiant Address', type: 'textarea', required: true },
            { key: 'statementOfFacts', label: 'Statement of Facts', type: 'textarea', required: true },
            { key: 'jurisdiction', label: 'County', type: 'text', required: true },
            { key: 'dateOfAffidavit', label: 'Date of Affidavit', type: 'date', required: true },
        ],
        content: `REPUBLIC OF LIBERIA
[jurisdiction] COUNTY

AFFIDAVIT

I, [affiantName], being duly sworn, depose and state as follows:

1. I am over the age of 18 years and am competent to make this affidavit.

2. My address is: [affiantAddress]

3. I make this affidavit based on my personal knowledge of the facts set forth herein.

STATEMENT OF FACTS

[statementOfFacts]

I declare under penalty of perjury under the laws of the Republic of Liberia that the foregoing is true and correct to the best of my knowledge and belief.

Executed on [dateOfAffidavit].

________________________
[affiantName]
Affiant

Subscribed and sworn to before me this _____ day of __________, 20____.

________________________
Justice of the Peace / Notary Public
My Commission Expires: _______________`,
        createdAt: '2024-02-01T11:00:00Z',
        usageCount: 35,
        estimatedTime: '< 1 min',
    },
    {
        id: 'tpl_petition',
        name: 'Legal Petition',
        category: 'Petition',
        description: 'Formal petition to a court or government authority.',
        icon: 'document',
        fields: [
            { key: 'clientName', label: 'Petitioner Name', type: 'text', required: true },
            { key: 'respondentName', label: 'Respondent Name', type: 'text', required: true },
            { key: 'courtName', label: 'Court / Authority Name', type: 'text', required: true },
            { key: 'caseNumber', label: 'Case Number (if assigned)', type: 'text', required: false },
            { key: 'reliefSought', label: 'Relief Sought', type: 'textarea', required: true },
            { key: 'groundsForPetition', label: 'Grounds for Petition', type: 'textarea', required: true },
            { key: 'jurisdiction', label: 'County', type: 'text', required: true },
            { key: 'dateOfFiling', label: 'Date of Filing', type: 'date', required: true },
        ],
        content: `REPUBLIC OF LIBERIA
IN THE [courtName] FOR [jurisdiction] COUNTY

Case No.: [caseNumber]

IN THE MATTER OF:

[clientName],
Petitioner,

v.

[respondentName],
Respondent.

PETITION

TO THE HONORABLE COURT:

COMES NOW [clientName] ("Petitioner"), by and through undersigned counsel, and respectfully petitions this Court for the relief described herein, and in support thereof states as follows:

JURISDICTION AND VENUE

1. This Court has jurisdiction over this matter pursuant to the laws of the Republic of Liberia.
2. Venue is proper in this Court in [jurisdiction] County.

PARTIES

3. Petitioner [clientName] is a resident of [jurisdiction] County.
4. Respondent [respondentName] is subject to the jurisdiction of this Court.

GROUNDS FOR PETITION

[groundsForPetition]

RELIEF REQUESTED

WHEREFORE, Petitioner respectfully requests that this Court:

[reliefSought]

Respectfully submitted this [dateOfFiling].

________________________
Counsel for Petitioner
[jurisdiction]`,
        createdAt: '2024-02-10T09:30:00Z',
        usageCount: 21,
        estimatedTime: '< 2 min',
    },
    {
        id: 'tpl_employment',
        name: 'Employment Contract',
        category: 'Contract',
        description: 'Standard employment agreement between employer and employee.',
        icon: 'briefcase',
        fields: [
            { key: 'employerName', label: 'Employer / Company Name', type: 'text', required: true },
            { key: 'clientName', label: 'Employee Full Name', type: 'text', required: true },
            { key: 'jobTitle', label: 'Job Title / Position', type: 'text', required: true },
            { key: 'startDate', label: 'Start Date', type: 'date', required: true },
            { key: 'salary', label: 'Annual Salary ($)', type: 'text', required: true },
            { key: 'workHours', label: 'Weekly Work Hours', type: 'text', required: true },
            { key: 'duties', label: 'Primary Duties & Responsibilities', type: 'textarea', required: true },
            { key: 'jurisdiction', label: 'Liberian County', type: 'text', required: true },
        ],
        content: `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into as of [startDate] between:

[employerName] ("Employer")
and
[clientName] ("Employee")

1. POSITION AND DUTIES
Employer hereby employs Employee as [jobTitle]. Employee's duties shall include:
[duties]

Employee agrees to devote [workHours] hours per week to the performance of said duties.

2. COMPENSATION
Employer shall pay Employee an annual salary of $[salary], payable in accordance with Employer's standard payroll schedule.

3. BENEFITS
Employee shall be entitled to benefits as described in the Employee Handbook, which may be amended from time to time.

4. AT-WILL EMPLOYMENT
Employment under this Agreement is at-will. Either party may terminate this Agreement at any time, with or without cause or notice.

5. CONFIDENTIALITY
Employee agrees to maintain the confidentiality of Employer's proprietary information and trade secrets during and after employment.

6. NON-COMPETITION
During employment and for 12 months thereafter, Employee agrees not to engage in any business competitive with Employer's business within [jurisdiction] County, Liberia.

7. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the labor laws of the Republic of Liberia.

________________________              ________________________
[employerName]                        [clientName]
Employer                              Employee
Date: _______________                 Date: _______________`,
        createdAt: '2024-03-01T08:00:00Z',
        usageCount: 63,
        estimatedTime: '< 2 min',
    },
    {
        id: 'tpl_demand',
        name: 'Demand Letter',
        category: 'Correspondence',
        description: 'Formal demand letter asserting a legal claim or seeking action.',
        icon: 'mail',
        fields: [
            { key: 'clientName', label: 'Sender / Claimant Name', type: 'text', required: true },
            { key: 'recipientName', label: 'Recipient Name', type: 'text', required: true },
            { key: 'recipientAddress', label: 'Recipient Address', type: 'textarea', required: true },
            { key: 'demandDescription', label: 'Nature of Claim / Demand', type: 'textarea', required: true },
            { key: 'amountDemanded', label: 'Amount Demanded ($)', type: 'text', required: false },
            { key: 'responseDeadline', label: 'Response Deadline (days)', type: 'number', required: true },
            { key: 'dateOfLetter', label: 'Date of Letter', type: 'date', required: true },
        ],
        content: `[dateOfLetter]

VIA CERTIFIED MAIL — RETURN RECEIPT REQUESTED

[recipientName]
[recipientAddress]

Re: DEMAND FOR [demandDescription]

Dear [recipientName]:

This firm represents [clientName] ("Client") in connection with the above-referenced matter. I write to demand that you immediately take the following action:

BACKGROUND

[demandDescription]

DEMAND

Accordingly, we hereby demand that you remit payment in the amount of $[amountDemanded] and/or take appropriate remedial action no later than [responseDeadline] days from the date of this letter.

CONSEQUENCES OF NON-COMPLIANCE

Should you fail to comply with this demand within the specified time period, our client is prepared to pursue all available legal remedies, including but not limited to filing suit in a court of competent jurisdiction and seeking all available damages, attorneys' fees, and costs.

Please govern yourself accordingly.

Very truly yours,

________________________
Counsel for [clientName]`,
        createdAt: '2024-03-10T12:00:00Z',
        usageCount: 118,
        estimatedTime: '< 1 min',
    },
    {
        id: 'tpl_land_deed',
        name: 'Land Deed',
        category: 'Deed',
        description: 'Legal document for the transfer of land ownership from a grantor to a grantee.',
        icon: 'home',
        fields: [
            { key: 'grantorName', label: 'Grantor (Seller) Name', type: 'text', required: true },
            { key: 'grantorAddress', label: 'Grantor Address', type: 'textarea', required: true },
            { key: 'granteeName', label: 'Grantee (Buyer) Name', type: 'text', required: true },
            { key: 'granteeAddress', label: 'Grantee Address', type: 'textarea', required: true },
            { key: 'propertyDescription', label: 'Legal Description of Property', type: 'textarea', required: true },
            { key: 'purchasePrice', label: 'Purchase Price ($)', type: 'text', required: true },
            { key: 'county', label: 'County (e.g. Montserrado)', type: 'text', required: true },
            { key: 'executionDate', label: 'Date of Execution', type: 'date', required: true },
        ],
        content: `REPUBLIC OF LIBERIA
[county] COUNTY

WARRANTY DEED

KNOW ALL MEN BY THESE PRESENTS:

That [grantorName], whose address is [grantorAddress] (hereinafter referred to as "Grantor"), for and in consideration of the sum of $[purchasePrice] and other good and valuable consideration, the receipt and sufficiency of which is hereby acknowledged, does hereby grant, bargain, sell, convey, and warrant unto [granteeName], whose address is [granteeAddress] (hereinafter referred to as "Grantee"), the following described real property situated in the County of [county], Republic of Liberia, to wit:

[propertyDescription]

TO HAVE AND TO HOLD the above-described premises, together with all appurtenances thereunto belonging, unto the said Grantee, their heirs, and assigns forever.

And the Grantor does hereby covenant with the Grantee that the Grantor is lawfully seized of said land in fee simple; that the Grantor has good right and lawful authority to sell and convey said land; and that the Grantor hereby fully warrants the title to said land and will defend the same against the lawful claims of all persons whomsoever.

IN WITNESS WHEREOF, the Grantor has executed this Deed on this [executionDate].

________________________
[grantorName]
Grantor

ACKNOWLEDGMENT

REPUBLIC OF LIBERIA
[county] COUNTY

On this _____ day of __________, 20____, before me, a Notary Public or Justice of the Peace in and for said County and Republic, personally appeared [grantorName], known to me to be the person whose name is subscribed to the within instrument, and acknowledged to me that they executed the same for the purposes therein contained.

________________________
Justice of the Peace / Notary Public
My Commission Expires: _______________`,
        createdAt: '2024-04-02T10:00:00Z',
        usageCount: 15,
        estimatedTime: '< 3 min',
    },
]
