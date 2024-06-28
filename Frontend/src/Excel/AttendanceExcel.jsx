import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';


const AttendanceExcel = (props) => {

  const generateExcel1 = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet2 = workbook.addWorksheet('client');
    console.log(props.client,'props client')

    // Add border to the cell
     const borderStyle = { style: 'medium', color: { argb: '000000' }}; 
    // ---------------------------------------Trade Shown Result---------------------------------------------------
    // Example: Adding data to worksheet2
    worksheet2.getCell(`C4`).value =  'SerialNo';
    worksheet2.getCell(`C4`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
    worksheet2.getCell(`D4`).value =  'Enrollment No';
    worksheet2.getCell(`D4`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
    worksheet2.getCell(`E4`).value = 'Class Name';
    worksheet2.getCell(`E4`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
    worksheet2.getCell(`F4`).value =  'Student Name';
    worksheet2.getCell(`F4`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
    worksheet2.getCell(`G4`).value =  'Date';
    worksheet2.getCell(`G4`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
    worksheet2.getCell(`H4`).value =  'Time';
    worksheet2.getCell(`H4`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
    worksheet2.getCell(`I4`).value =  'Status';
    worksheet2.getCell(`I4`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};

    for (let i = 0; i < props.client.length; i++) {
        worksheet2.getCell(`C${i + 5}`).value =  `${i+1}`
        worksheet2.getCell(`C${i + 5}`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
        worksheet2.getCell(`D${i + 5}`).value =  `${props.client[i].enrollment_no}`
        worksheet2.getCell(`D${i + 5}`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
        worksheet2.getCell(`E${i + 5}`).value = `${props.client[i].class_name}`
        worksheet2.getCell(`E${i + 5}`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
        worksheet2.getCell(`F${i + 5}`).value =  `${props.client[i].student_name}`
        worksheet2.getCell(`F${i + 5}`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
        worksheet2.getCell(`G${i + 5}`).value =  `${props.client[i].date?.slice(0,10)}`
        worksheet2.getCell(`G${i + 5}`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
        worksheet2.getCell(`H${i + 5}`).value =  `${props.client[i].time}`
        worksheet2.getCell(`H${i + 5}`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
        worksheet2.getCell(`I${i + 5}`).value =  `${props.client[i].status}`
        worksheet2.getCell(`I${i + 5}`).border = {top: borderStyle,left: borderStyle,bottom: borderStyle,right: borderStyle};
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
      saveAs(data, 'attendance_sheet.xlsx');
    });
  };

  return (
    <div className='w-full'>
      <button className="py-2 px-3 border-0 btn-ptimary btn bg-primary rounded-pill text-white"  size="sm" color='primary' onClick={generateExcel1}>Download Excel  <i className='fas fa-download'></i>  </button>
    </div>
  );
};

export default AttendanceExcel;