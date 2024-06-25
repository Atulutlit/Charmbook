const BASE_URL='http://localhost:5000'
// const BASE_URL= 'https://rrxts0qg-5000.inc1.devtunnels.ms'

// admin api
export const ADMIN_LOGIN_URL=BASE_URL + "/api/admin/login";
export const ADMIN_CREATE_USER=BASE_URL + "/api/admin/user/create";  // create both student and teacher
export const ADMIN_UPDATE_USER=BASE_URL + "/api/admin/user";  // update both student and teacher data
export const ADMIN_CREATE_SUBJECT=BASE_URL + "/api/admin/subject";
export const ADMIN_USER_COUNT=BASE_URL + "/api/admin/users/count";

export const ADMIN_CLASS=BASE_URL + '/api/admin/class';
export const ADMIN_CREATE_CLASS=BASE_URL + "/api/admin/class/create";
export const ADMIN_DELETE_CLASS=BASE_URL + "/api/admin/class";
export const ADMIN_UPDATE_CLASS = BASE_URL + "/api/admin/class";

// teacher api
export const ADMIN_TEACHER = BASE_URL + '/api/admin/teachers';
export const ADMIN_REMOVE_TEACHER = BASE_URL + '/api/admin/teacher'; 
export const ADMIN_CREATE_CLASS_TEACHER = BASE_URL + '/api/admin/class/teacher/create';
export const ADMIN_REMOVE_CLASS_TEACHER = BASE_URL + "/api/admin/class/teacher/remove";

export const ADMIN_STUDENTS = BASE_URL + '/api/admin/students';
export const ADMIN_REMOVE_STUDENT = BASE_URL + '/api/admin/student';

export const ADMIN_GET_SUBJECT = BASE_URL + "/api/admin/subject";
export const ADMIN_DELETE_SUBJECT = BASE_URL + "/api/admin/subject";

export const ADMIN_CREATE_SCHEDULE = BASE_URL + "/api/admin/school/schedule/create";
export const ADMIN_GET_SCHEDULE = BASE_URL + "/api/admin/school/schedule"

// holiday api
export const ADMIN_HOLIDAY = BASE_URL + "/api/admin/holidays";
export const ADMIN_CREATE_HOLIDAY = BASE_URL + "/api/admin/holidays";
export const ADMIN_DELETE_HOLIDAY = BASE_URL + "/api/admin/holidays";
export const ADMIN_UPDATE_HOLIDAY = BASE_URL + "/api/admin/holidays";

// homework api
export const ADMIN_CREATE_HOMEWORK = BASE_URL + "/api/admin/homework";
export const ADMIN_GET_HOMEWORK = BASE_URL + "/api/admin/homeworks";

// get attendance api
export const ADMIN_GET_ATTENDANCE = BASE_URL + "/api/admin/attendance";
export const ADMIN_MARK_ATTENDANCE = BASE_URL + "/api/admin/mark/attendance";

// create timetable api
export const ADMIN_CREATE_TIMETABLE = BASE_URL + "/api/admin/timetable";
export const ADMIN_GET_TIMETABLE = BASE_URL + "/api/admin/timetable";
export const ADMIN_UPDATE_TIMETABLE = BASE_URL + '/api/admin/timetable';
export const ADMIN_DELETE_TIMETABLE = BASE_URL + "/api/admin/timetable";

// homework api
export const ADMIN_CREATE_HOMEWORK1=BASE_URL + "/api/add/homework";
export const ADMIN_DELETE_HOMEWORK=BASE_URL + "/api/admin/homework";
export const ADMIN_UPDATE_HOMEWORK=BASE_URL + "/api/update/homework";
export const ADMIN_GET_HOMEWORK1 = BASE_URL + "/api/admin/homworks";

// test api
export const ADMIN_CREATE_TEST = BASE_URL + "/api/admin/add/test";
export const ADMIN_DELETE_TEST = BASE_URL + "/api/admin/test";
export const ADMIN_GET_TEST = BASE_URL + "/api/admin/tests";

// book management
export const ADMIN_GET_SUBJECT1= BASE_URL + "/api/admin/subject";
export const ADMIN_CREATE_BOOK = BASE_URL + "/api/admin/add/book";
export const ADMIN_DELETE_BOOK = BASE_URL + "/api/admin/book";
export const ADMIN_UPDATE_BOOK = BASE_URL + "/api/admin/update/book";
export const ADMIN_ADD_CHAPTER = BASE_URL + "/api/admin/add/chapter";
export const ADMIN_GET_BOOK = BASE_URL + "/api/admin/books";

// upload image
export const ADMIN_UPLOAD_IMAGE = BASE_URL + "/api/admin/image";
export const ADMIN_UPLOAD_DOC = BASE_URL + "/api/admin/doc";
export const ADMIN_FILE_DELETE = BASE_URL + "/api/admin/file/delete";

// notification
export const ADMIN_GET_NOTIFICATION = BASE_URL + "/api/admin/notification"
export const ADMIN_ADD_NOTIFICATION = BASE_URL + "/api/admin/notification"

//-------------------------------User API ---------------------------------------
// USER API

export const STUDENT_GET_TIMETABLE = BASE_URL + "/api/user/timetable";
export const STUDENT_GET_HOMEWORK = BASE_URL + "/api/user/homework";
export const STUDENT_GET_ATTENDANCE = BASE_URL + "/api/user/attendance";
export const STUDNET_GET_BOOk = BASE_URL + "/api/user/book";
export const STUDENT_GET_TEST = BASE_URL + "/api/user/test";


// ------------------------ TEACHER API ----------------------------------------------


// timetable
export const TEACHER_CREATE_TIMETABLE = BASE_URL + "/api/teacher/timetable";
export const TEACHER_GET_TIMETABLE = BASE_URL + "/api/teacher/timetable";
export const TEACHER_UPDATE_TIMETABLE = BASE_URL + "/api/teacher/timetable";
export const TEACHER_DELETE_TIMETABLE = BASE_URL + "/api/teacher/timetable";

// homework
export const TEACHER_ADD_HOMEWORK = BASE_URL + "/api/teacher/add/homework";
export const TEACHER_DELETE_HOMEWORK = BASE_URL + "/api/teacher/homework";
export const TEACHER_UPDATE_HOMEWORK = BASE_URL + "/api/teacher/update/homework";
export const TEACHER_GET_HOMEWORK = BASE_URL + "/api/teacher/homework";

// get attendance
export const TEACHER_GET_ATTENDANCE = BASE_URL + "/api/teacher/attendance";
export const TEACHER_MARK_ATTENDANCE = BASE_URL + "teacher/mark/attendance";

// book management
export const TEACHER_GET_SUBJECT1= BASE_URL + "/api/teacher/subject";
export const TEACHER_CREATE_BOOK = BASE_URL + "/api/teacher/add/book";
export const TEACHER_DELETE_BOOK = BASE_URL + "/api/teacher/update/book";
export const TEACHER_UPDATE_BOOK = BASE_URL + "/api/teacher/update/book";
export const TEACHER_ADD_CHAPTER = BASE_URL + "/api/teacher/add/chapter";
export const TEACHER_GET_BOOK1 = BASE_URL + "/api/teacher/books";

// test
export const TEACHER_CREATE_TEST = BASE_URL + "/api/teacher/add/test";
export const TEACHER_DELTE_TEST = BASE_URL + "/api/teacher/test";
export const TEACHER_GET_TEST = BASE_URL + "/api/teacher/tests";