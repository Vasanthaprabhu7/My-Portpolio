import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def build_pdf():
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'assets')
    os.makedirs(output_dir, exist_ok=True)
    pdf_path = os.path.join(output_dir, 'G_T_Vasanthaprabhu_Resume.pdf')

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    name_style = ParagraphStyle(
        'DocName',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        alignment=TA_CENTER,
        textColor=colors.black,
        spaceAfter=3
    )

    email_style = ParagraphStyle(
        'DocEmail',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=13,
        alignment=TA_CENTER,
        textColor=colors.black,
        spaceAfter=6
    )

    contact_style = ParagraphStyle(
        'DocContact',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=12,
        alignment=TA_CENTER,
        textColor=colors.black,
        spaceAfter=14
    )

    sec_title_style = ParagraphStyle(
        'SecTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textTransform='uppercase',
        textColor=colors.black,
        spaceBefore=10,
        spaceAfter=2
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        alignment=TA_JUSTIFY,
        textColor=colors.black,
        spaceAfter=8
    )

    bold_style = ParagraphStyle(
        'DocBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.black
    )

    bold_right = ParagraphStyle(
        'DocBoldRight',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        alignment=TA_RIGHT,
        textColor=colors.black
    )

    sub_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12.5,
        textColor=colors.black
    )

    sub_right = ParagraphStyle(
        'DocSubRight',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12.5,
        alignment=TA_RIGHT,
        textColor=colors.black
    )

    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12.5,
        textColor=colors.black,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=2.5
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.black
    )

    table_body = ParagraphStyle(
        'TableBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.black,
        leftIndent=10,
        firstLineIndent=-8
    )

    story = []

    def add_section_header(title):
        story.append(Paragraph(title, sec_title_style))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.black, spaceBefore=2, spaceAfter=6))

    # ==================== PAGE 1 ====================
    # Header
    story.append(Paragraph("G.T.VASANTHAPRABHU", name_style))
    story.append(Paragraph("vasanthaprabhu3072004@gmail.com", email_style))
    contact_text = (
        "&#9742; 6382368204 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        "&#128279; <a href='https://www.linkedin.com/in/vasanthaprabhu'><u>www.linkedin.com/in/vasanthaprabhu</u></a> "
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        "&#128187; <a href='https://github.com/Vasanthaprabhu7'><u>https://github.com/Vasanthaprabhu7</u></a>"
    )
    story.append(Paragraph(contact_text, contact_style))

    # Career Objective
    add_section_header("CAREER OBJECTIVE")
    obj_text = (
        "Motivated Enthusiastic and dedicated Computer Science Engineering graduate with a strong "
        "foundation in Python, SQL, Generative AI, and Data Analytics. Seeking an entry-level "
        "opportunity in software development, data analytics, or artificial intelligence where I can "
        "apply my technical knowledge, programming skills, and problem-solving abilities to real-world challenges. "
        "I am eager to learn new technologies, work collaboratively with teams, develop efficient and "
        "innovative solutions, and contribute to the growth and success of the organization while "
        "continuously improving my technical and professional skills."
    )
    story.append(Paragraph(obj_text, body_style))

    # Education
    add_section_header("EDUCATION")
    edu_data = [
        [
            Paragraph("R.V.S. COLLEGE OF ENGINEERING", bold_style),
            Paragraph("2022-2026", bold_right)
        ],
        [
            Paragraph("Bachelor of Engineering (B.E.) – Computer Science and Engineering,Dindigul", sub_style),
            Paragraph("CGPA:8.33", sub_right)
        ],
        [
            Paragraph("VISWA VIDHYALAYA MATRIC HIGHER SEC SCHOOL", bold_style),
            Paragraph("HSC:77%", bold_right)
        ],
        [
            Paragraph("Higher Secondary Education", sub_style),
            Paragraph("SSLC:86%", sub_right)
        ]
    ]
    edu_table = Table(edu_data, colWidths=[400, 140])
    edu_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1.5),
        ('TOPPADDING', (0,0), (-1,-1), 1.5),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(edu_table)
    story.append(Spacer(1, 6))

    # Technical Skills
    add_section_header("TECHNICAL SKILLS")
    
    prog_col = (
        "<table width='100%'><tr>"
        "<td width='50%' valign='top'>"
        "&bull; Python<br/>"
        "&bull; CSS<br/>"
        "&bull; ReactJS"
        "</td>"
        "<td width='50%' valign='top'>"
        "&bull; HTML<br/>"
        "&bull; JavaScript"
        "</td>"
        "</tr></table>"
    )
    
    query_col = "&bull; SQL"
    
    genai_col = (
        "&bull; Machine Learning<br/>"
        "&bull; Deep Learning<br/>"
        "&bull; NLP, LLM<br/>"
        "&bull; RAG &ndash; FineTuning"
    )

    skills_data = [
        [
            Paragraph("PROGRAMMING LANGUAGES", table_header),
            Paragraph("QUERY LANGUAGES", table_header),
            Paragraph("GENERATIVE AI", table_header)
        ],
        [
            Paragraph(prog_col, table_body),
            Paragraph(query_col, table_body),
            Paragraph(genai_col, table_body)
        ]
    ]
    skills_table = Table(skills_data, colWidths=[200, 140, 200])
    skills_table.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1.2, colors.black),
        ('INNERGRID', (0,0), (-1,-1), 1.2, colors.black),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F8F8F8')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(skills_table)
    story.append(Spacer(1, 6))

    # Projects (Page 1 project)
    add_section_header("PROJECTS")
    proj1_header = [
        [
            Paragraph("Real Time Smart Blood Donation Coordination System", bold_style),
            Paragraph("2025-2026", bold_right)
        ]
    ]
    t1 = Table(proj1_header, colWidths=[400, 140])
    t1.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t1)
    story.append(Paragraph("&bull; Developed a centralized platform to connect hospitals and eligible blood donors in real time.", bullet_style))
    story.append(Paragraph("&bull; Matches donors based on blood group, location, and eligibility.", bullet_style))
    story.append(Paragraph("&bull; Enables hospitals to send blood requests and provides instant notifications to suitable donors.", bullet_style))
    story.append(Paragraph("&bull; Reduces manual coordination and delays in blood availability, supporting faster emergency response.", bullet_style))

    # ==================== PAGE 2 ====================
    story.append(PageBreak())

    # Project 2
    proj2_header = [
        [
            Paragraph("Social Media Analytics Using Python", bold_style),
            Paragraph("2026", bold_right)
        ]
    ]
    t2 = Table(proj2_header, colWidths=[400, 140])
    t2.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t2)
    story.append(Paragraph("&bull; Analyzed social media data to identify engagement patterns and user interaction trends.", bullet_style))
    story.append(Paragraph("&bull; Used Python for data processing, analysis, and extracting meaningful insights.", bullet_style))
    story.append(Paragraph("&bull; Performed data analysis to understand social media performance and audience behavior.", bullet_style))
    story.append(Spacer(1, 8))

    # Project 3
    proj3_header = [
        [
            Paragraph("Customer Churn Prediction", bold_style),
            Paragraph("2026", bold_right)
        ]
    ]
    t3 = Table(proj3_header, colWidths=[400, 140])
    t3.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t3)
    story.append(Paragraph("&bull; Developed a machine learning project using Python to predict customer churn.", bullet_style))
    story.append(Paragraph("&bull; Performed data preprocessing and exploratory data analysis using Pandas and NumPy.", bullet_style))
    story.append(Paragraph("&bull; Analyzed customer patterns to identify factors affecting customer retention.", bullet_style))
    story.append(Spacer(1, 8))

    # Internship
    add_section_header("INTERNSHIP")
    intern_header = [
        [
            Paragraph("Full Stack Web Development Intern", bold_style),
            Paragraph("2025", bold_right)
        ]
    ]
    t_intern = Table(intern_header, colWidths=[400, 140])
    t_intern.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_intern)
    story.append(Paragraph("<b>Main Flow Services and Technologies Pvt. Ltd.</b>", bold_style))
    story.append(Paragraph("<b>05/07/2025 &ndash; 05/08/2025</b>", bold_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("&bull; Gained hands-on exposure to the end-to-end web application development process.", bullet_style))
    story.append(Paragraph("&bull; Worked on practical development tasks with a focus on building and improving web-based solutions.", bullet_style))
    story.append(Paragraph("&bull; Enhanced understanding of application structure, development workflow, and technical implementation.", bullet_style))
    story.append(Paragraph("&bull; Contributed effectively during team activities while strengthening communication and coordination skills.", bullet_style))
    story.append(Paragraph("&bull; Improved analytical thinking, attention to detail, adaptability, and professional work practices through project-based learning.", bullet_style))
    story.append(Spacer(1, 10))

    # Languages
    add_section_header("LANGUAGES")
    story.append(Paragraph("&bull; <b>Tamil</b> (Native)", bullet_style))
    story.append(Paragraph("&bull; <b>English</b> (Conversational)", bullet_style))

    doc.build(story)
    print(f"Successfully generated: {pdf_path}")

if __name__ == '__main__':
    build_pdf()
