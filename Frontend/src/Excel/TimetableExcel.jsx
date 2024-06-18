import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';


const TimeTableExcel = (props) => {

  const generateExcel1 = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet2 = workbook.addWorksheet('client');
    console.log(props.client,'props client')

    // Add border to the cell
     const borderStyle = { style: 'medium', color: { argb: '000000' }}; 
    // ---------------------------------------Trade Shown Result---------------------------------------------------
    // Example: Adding data to worksheet2
    worksheet2.getCell(`A1`).value =  'SerialNo';
    worksheet2.getCell(`A1`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
    worksheet2.getCell(`B1`).value =  'Class';
    worksheet2.getCell(`B1`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
    worksheet2.getCell(`C1`).value = 'Subject Name';
    worksheet2.getCell(`C1`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
    worksheet2.getCell(`D1`).value =  'Start Time';
    worksheet2.getCell(`D1`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
    worksheet2.getCell(`E1`).value =  'End Time';
    worksheet2.getCell(`E1`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
    worksheet2.getCell(`F1`).value =  'Period';
    worksheet2.getCell(`F1`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
    worksheet2.getCell(`G1`).value =  'Teacher Name';
    worksheet2.getCell(`G1`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};

    for (let i = 0; i < props.client.length; i++) {
        worksheet2.getCell(`A${i + 2}`).value =  `${i+1}`
        worksheet2.getCell(`A${i + 2}`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
        worksheet2.getCell(`B${i + 2}`).value =  `${props.client[i]?.client?.id}`
        worksheet2.getCell(`B${i + 2}`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
        worksheet2.getCell(`C${i + 2}`).value = `${props.client[i]?.subject?.subject_name}`
        worksheet2.getCell(`C${i + 2}`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
        worksheet2.getCell(`D${i + 2}`).value =  `${props.client[i]?.start_time}`
        worksheet2.getCell(`D${i + 2}`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
        worksheet2.getCell(`E${i + 2}`).value =  `${props.client[i]?.end_time}`
        worksheet2.getCell(`E${i + 2}`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
        worksheet2.getCell(`F${i + 2}`).value =  `${props.client[i]?.period_no}`
        worksheet2.getCell(`F${i + 2}`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
        worksheet2.getCell(`G${i + 2}`).value =  `${props.client[i]?.teacher_id}`
        worksheet2.getCell(`G${i + 2}`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
    }
    worksheet2.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle};
      });
    });
    
    // -----------------------------------User Show Result----------------------------------------------------------------


    // Save the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      saveAs(data, 'timetable_sheet.xlsx');
    });
  };

  return (
    <div className='w-full'>
      <button className="" style={{backgroundColor:"blue",color:"white",height:"40px",borderRadius:"10px"}} onClick={generateExcel1}>Download Excel</button>
    </div>
  );
};

export default TimeTableExcel;