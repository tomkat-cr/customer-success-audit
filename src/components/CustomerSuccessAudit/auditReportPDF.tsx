import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type UserInfo = import('./dataDefinitions.tsx').UserInfo;   
type Score = import('./dataDefinitions.tsx').Score;
type Recommendations = import('./dataDefinitions.tsx').Recommendations;
type Section = import('./dataDefinitions.tsx').Section;
type Answers = import('./dataDefinitions.tsx').Answers;

const getLineHeight = (doc: jsPDF, numLines: number = 1) => {
    return (doc.getLineHeight() / doc.internal.scaleFactor) * numLines;
};

export const auditReportPDF = (
    userInfo: UserInfo,
    score: Score,
    recommendations: Recommendations,
    auditSections: Section[],
    answers: Answers
) => {
    const doc = new jsPDF();
    let finalY = 20;

    // 1. Header
    doc.setFontSize(12);
    doc.text('OTO Visual Flow by Omar Tobon', 105, finalY, { align: 'center' });

    finalY += getLineHeight(doc) + 5;
    doc.setFontSize(22);
    doc.text('Reporte de Auditoría de Customer Success', 105, finalY, { align: 'center' });

    finalY += getLineHeight(doc);
    doc.setFontSize(16);
    doc.text(`Para: ${userInfo.name} - ${userInfo.company}`, 105, finalY, { align: 'center' });

    finalY += getLineHeight(doc);
    doc.setLineWidth(0.5);
    doc.line(20, finalY, 190, finalY);

    // 2. Summary Section
    finalY += getLineHeight(doc) + 5;
    doc.setFontSize(18);
    doc.text('Resumen de sus Resultados', 20, finalY);

    finalY += getLineHeight(doc) - 2;
    autoTable(doc, {
        startY: finalY,
        head: [['Score', 'Level', 'Title']],
        body: [
            [`${score.percentage}%`, recommendations.level, recommendations.title]
        ],
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 186] },
    });

    // 3. Recommendations
    finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(16);
    doc.text('Plan de Acciones Prioritarias', 20, finalY + 15);
    const nextStepsBody = recommendations.nextSteps.map((step, index) => [index + 1, step]);
    autoTable(doc, {
        startY: finalY + 20,
        head: [['#', 'Next Step']],
        body: nextStepsBody,
        theme: 'grid',
        headStyles: { fillColor: [22, 160, 133] },
        columnStyles: { 0: { cellWidth: 10 } }
    });

    // 4. Detailed Answers Section
    doc.addPage();
    doc.setFontSize(18);
    doc.text('Respuestas Detalladas de la Auditoría', 20, 20);

    const tableBody: any[][] = [];
    auditSections.forEach(section => {
        tableBody.push([{ content: section.title, colSpan: 3, styles: { fontStyle: 'bold', fillColor: '#f0f0f0' } }]);
        section.questions.forEach(question => {
            const answerPoints = answers[question.id];
            const selectedOption = question.options.find(opt => opt.points === answerPoints);
            tableBody.push([
                question.question,
                selectedOption ? selectedOption.text : 'No Respondido',
                answerPoints !== undefined ? answerPoints : 'N/A'
            ]);
        });
    });

    autoTable(doc, {
        startY: 25,
        head: [['Pregunta', 'Su respuesta', 'Puntos']],
        body: tableBody,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 186] },
    });

    // 5. Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`OTO Visual Flow | https://omartobon.com | Todos los derechos reservados | Pág. ${i} de ${pageCount}`, 105, 290, { align: 'center' });
    }

    return doc;
};
