const { sequelize } = require('./models');

const User = sequelize.import("./user");
const Otp = sequelize.import("./otp");
const Class = sequelize.import("./class");
const TimeTable = sequelize.import("./time_table");
const Homework = sequelize.import("./homework");
const Admin = sequelize.import("./admin");
const ClassTeacher = sequelize.import("./class_teacher");
const Attendance = sequelize.import("./attendance");
const School_schedule = sequelize.import("./school_schedule");
const Book = sequelize.import("./book");
const Subject = sequelize.import("./subject");
const Test = sequelize.import("./tests");
const Holiday = sequelize.import("./holiday");
const Fcm_token = sequelize.import("./fcm_token");
const Notification = sequelize.import("./notification")


User.hasOne(Otp, { foreignKey: 'user_id' });
Otp.belongsTo(User, { foreignKey: 'user_id' });

Class.hasMany(User, { foreignKey: 'class_id' });
User.belongsTo(Class, { foreignKey: 'class_id' });

User.hasOne(ClassTeacher, { foreignKey: 'teacher_id' });
ClassTeacher.belongsTo(User, { foreignKey: 'teacher_id' });
ClassTeacher.belongsTo(Class,{ foreignKey: 'class_id'});

User.hasMany(Attendance, { foreignKey: 'student_id' });
Attendance.belongsTo(User, { foreignKey: 'student_id' });

Class.hasMany(Book, { foreignKey: 'class_id' });
Book.belongsTo(Class, { foreignKey: 'class_id' });

Subject.hasOne(Book, { foreignKey: 'subject_id' });
Book.belongsTo(Subject, { foreignKey: 'subject_id' });

Book.hasMany(Homework, { foreignKey: 'book_id' });
Homework.belongsTo(Book, { foreignKey: 'book_id' });

// Book.hasMany(Test, { foreignKey: 'book_id' });
// Test.belongsTo(Book, { foreignKey: 'book_id' });
Test.belongsTo(Class, { foreignKey: 'class_id' });
Test.belongsTo(User, { foreignKey: 'teacher_id' });
Test.belongsTo(Subject , { foreignKey: 'subject_id' })


Subject.hasMany(TimeTable, { foreignKey: 'subject_id' });
TimeTable.belongsTo(Subject, { foreignKey: 'subject_id' });

Class.hasMany(TimeTable, { foreignKey: 'class_id' });
TimeTable.belongsTo(Class, { foreignKey: 'class_id' });

// User.hasOne(Admin, { foreignKey: 'user_id' });
// Admin.belongsTo(User, { foreignKey: 'user_id' });


// TimeTable.sync({force:true})

// Fcm_token.sync({force:true})


module.exports = {
    User,
    Otp,
    Class,
    TimeTable,
    Homework,
    Admin,
    ClassTeacher,
    Attendance,
    School_schedule,
    Book,
    Subject,
    Test,
    Holiday,
    Fcm_token,
    Notification
}