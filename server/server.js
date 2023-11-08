const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const fs = require('fs');
const PDFDocument = require('pdfkit');
const sizeOf = require('image-size');

const port = process.env.PORT || 3000;
const secretKey = 'mySecretKeyForJWTAuthentication';// for token generation

const app = express();

// const ipAddress = '192.168.1.14';


app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); 

// Firebase Next Link
const admin = require('firebase-admin');
const serviceAccount = require('./paplapplication-firebase-adminsdk-dlrxg-4adbf847ee.json');
const { error } = require('console');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://paplapplication-default-rtdb.firebaseio.com',
});

const Firebase_db = admin.database();
const ref = Firebase_db.ref('/Leave/Leaveforleadknown/krishnannarayananpaplcorpcom');


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'paplworkspace',
});


db.connect((err) => {
  if (err) {
    console.error('Error', err);
    return;
  } else {
    console.log('Connected to MySQL');
  }
});

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'paplsoft.itservice@gmail.com',
    pass: 'cicc tahd itrg guwd',
  },
});


app.get('/api/leaveData', (req, res) => {
  const ref = Firebase_db.ref('/Leave/Leaveforleadknown/krishnannarayananpaplcorpcom');

  const today = new Date();  // Get the current date
  const nextTwoMonths = new Date();
  nextTwoMonths.setMonth(today.getMonth() + 2);  // Set the date to two months from now

  ref.once('value', (snapshot) => {
    const data = snapshot.val();

    // Use an object to group data by date and month
    const groupedData = {};

    Object.keys(data).forEach(personName => {
      const from_personData = data[personName];

      Object.keys(from_personData).forEach(year => {
        const from_yearData = from_personData[year];

        Object.keys(from_yearData).forEach(month => {
          const from_monthData = from_yearData[month];

          Object.keys(from_monthData).forEach(date => {
            // Convert year, month, and date to a Date object for comparison
            const currentDate = new Date(`${year}-${month}-${date}`);

            // Check if the date is within the range of today to the next two months
            if (currentDate >= today && currentDate <= nextTwoMonths) {
              const dateString = currentDate.toISOString().split('T')[0];

              if (!groupedData[dateString]) {
                groupedData[dateString] = {
                  date: dateString,
                  names: [],
                };
              }

              groupedData[dateString].names.push(personName);
            }
          });
        });
      });
    });




    // Convert the grouped data object to an array
    const resultArray = Object.values(groupedData);

    res.json(resultArray);
  }, (errorObject) => {
    console.error('The read failed: ' + errorObject.code);
    res.status(500).send('Internal Server Error');
  });
});



app.post('/api/profileInsert',(req,res)=>{
  const {organization_name,address,pincode,state,country,contact,organization}=req.body;
  // console.log("server called",organization_name,address,pincode,state,country,contact,organization)


  db.query('INSERT INTO organization_profile(Organization_name,Address,Pincode,State,Country,Contact,Organization) VALUES (?,?,?,?,?,?,?)',[organization_name,address,pincode,state,country,contact,organization],(error,response)=>{
    if(error)
    {
      res.json("Error")
    }
    else{
      if(response)
      {
        res.json("Profile is uploaded")

      }
    }

  });
})


app.get('/api/Email_exists',(req,res)=>{
 

  const {Email}= req.body;
  console.log("server called",req.body)
  const query='SELECT Email FROM clientadmin where Email= ? ';
  db.query(query,[Email],(err,results)=>{
if(err){

  return res.status(500).json({ error: 'Internal server error' });


} 
else {
 
  const data = results[0];
  console.log(data)
  return res.json(data)
}


  });

});




app.get('/api/loginData',(req, res)=>{


  const query='SELECT Email,Username,Organization,Status,Role,Emailverified,Department FROM clientadmin';
  db.query(query,(err,results)=>{
    if(err)
    {
      // console.log("Error accoured",err);
      return res.status(500).json({ error: err });
    }
    else{
      
      // console.log(results)
      const arrayLength = results.length;
       Logineddata =[];
     
      
      // Iterate through the array
      for (let i = 0; i < arrayLength; i++) {


        // results[i].Password
         Logineddata[i] = results[i];


      
       
      }
      // console.log(Logineddata);
      res.json(Logineddata);


    }

  });

}
);

app.delete('/api/Role_Data_Delete', (req, res) => {
  const { organization, role } = req.body;

  // Ensure that the organization and department are provided in the request body
  if (!organization || !role) {
    return res.status(400).json({ error: 'Organization and department are required in the request body' });
  }

  db.query("DELETE FROM organization_role WHERE Organization=? AND Role=?", [organization, role], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    } 
    else {
      if (result.affectedRows > 0) {
        return res.json({ message: 'Delete Successful' });
      } else {
        return res.status(404).json({ error: 'Data not found for deletion' });
      }
    }
  });
});

app.delete('/api/Department_Data_Delete', (req, res) => {
  const { organization, department } = req.body;

  // Ensure that the organization and department are provided in the request body
  if (!organization || !department) {
    return res.status(400).json({ error: 'Organization and department are required in the request body' });
  }

  db.query("DELETE FROM organization_department WHERE Organization=? AND Department=?", [organization, department], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    } else {
      if (result.affectedRows > 0) {
        return res.json({ message: 'Delete Successful' });
      } else {
        return res.status(404).json({ error: 'Data not found for deletion' });
      }
    }
  });
});


app.delete('/api/adminregister_login_delete',(req,res)=>{
const{email}=req.body;
// console.log(email)
db.query('DELETE FROM `clientadmin` WHERE `Email`= ? ',[email],(err,results)=>{
  if (err) {
  return res.status(500).json({ error: 'Internal server error' });
}
else{
  // console.log(results)
  return res.status(401).json({ error: 'Delete Successfully' });
}


});

});



app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT Email,Password,Organization,Status,Role,Username,Emailverified FROM clientadmin WHERE Email = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      // console.log("+++", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      // console.log("---", err);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = results[0];

    bcrypt.compare(password, user.Password, (bcryptErr, bcryptResult) => {
      if (bcryptErr) {
        console.error('Bcrypt Compare Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!bcryptResult) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      try {
        const token = jwt.sign({ userId: username }, secretKey, {
          expiresIn: '1h',
        });

        const status = user.Status;
        const role = user.Role;
        const organization = user.Organization;
        const user_name=user.Username;
        const mail_status=user.Emailverified;

        res.json({ token, status, role, organization,user_name,mail_status });
      } 
      catch (error) {
        res.status(500).json({ error: 'Token creation failed' });
      }
    });
  });
});

app.put('/api/adminregister_login_update', (req, res) => {
  const {email,organization,role,lstatus,authenticator,username,emailverified,existingmail,department } = req.body;




  const verificationToken = uuidv4();
  // console.log("UPDATE CALL",email, organization, role, lstatus,authenticator,username,emailverified,verificationToken,department,existingmail)

  const query = `UPDATE clientadmin SET Email = ?, Organization = ?, Role = ?, Status = ?, Authenticator = ?, Username = ?, Emailverified = ?, Emailtoken = ?, Department=? WHERE Email = ?`;
 
    db.query(query, [email, organization, role, lstatus,authenticator,username,emailverified,verificationToken,department,existingmail], (error, result) => {
      if (error) {
        
        const error_print =  error.errno;
        // console.log('Error inserting data:', error);      
      
      }
      else{
     
        
      sendVerificationEmail(userid, verificationToken);
      console.log("Verification token",verificationToken,email,result);
      }
    });
});



app.post('/api/InsertRoleData',(req,res)=>{
  const{Role,Organization}=req.body;

  const query="INSERT INTO organization_role (Organization, Role) VALUES (?, ?)";
  db.query(query,[Organization,Role],(error,result)=>{
    if (error) {
      const errorNumber = error.errno;

      // Check for duplicate entry error (error code 1062)
      if (errorNumber === 1062) {
        res.status(400).json({ message: " This data already exists." });
      } else {
        // Handle other database errors
        console.error("Database Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
   
    else{
      // console.log("Insert Succes")
      res.status(200).json({ message: "Insert Successful" });
    }

      });
    
});

app.post('/api/InsertDepartmentData', (req, res) => {
  const { Department, Organization } = req.body;

  // SQL query to insert data into the database
  const query = "INSERT INTO organization_department (Organization, Department) VALUES (?, ?)";

  // Execute the SQL query
  db.query(query, [Organization, Department], (error, result) => {
    if (error) {
      const errorNumber = error.errno;

      // Check for duplicate entry error (error code 1062)
      if (errorNumber === 1062) {
        res.status(400).json({ message: " This data already exists." });
      } else {
        // Handle other database errors
        console.error("Database Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    } else {
      // Successful insertion
      res.status(200).json({ message: "Insert Successful" });
    }
  });
});



app.post('/api/InsertRoleData', (req, res) => {
  const { Role, Organization } = req.body;

  // SQL query to insert data into the database
  const query = "INSERT INTO organization_role (Organization, Role) VALUES (?, ?)";

  // Execute the SQL query using the connection pool
  db.query(query, [Organization, Role],  (error, result) => {
    if (error) {
      Console.log(error)
      const errorNumber = error.errno;

      // Check for duplicate entry error (error code 1062)
      if (errorNumber === 1062) {
        res.status(400).json({ message: " This data already exists." });
      } else {
        // Handle other database errors
        console.error("Database Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    } else {
      // Successful insertion
      console.log("INsertjjjjjjjjjjjjjjjjj")
      res.status(200).json({ message: "Insert Successful" });
    }
  });
});





app.post('/api/adminregister', (req, res) => {
  const { userid, password, organization, role,status,authenticator,name,statusnum,department } = req.body;

  const verificationToken = uuidv4();

  const query = 'INSERT INTO clientadmin (Email, Password, Organization, Role,Status,Authenticator,Username,Emailverified,Emailtoken,Department) VALUES (?, ?, ?, ?, ?,?,?,?,?,?)';
  bcrypt.hash(password, 12, (err, hash) => {
    if (err) {
      console.error('Bcrypt Hash Error:', err);
    } else {
      db.query(query, [userid, hash, organization, role, status,authenticator,name,statusnum,verificationToken,department], (error, result) => {
        if (error) {
          
          const error_print =  error.errno;
          // console.log('Error inserting data:',error );
          // typeof(error_print)

          if(1062==error_print){

            // console.log('Error inserting data++:', error_print);
          res.status(501).json({message:"Email Already exists"});
          }
          
        
        }
        else{
        res.status(200).json({ message: 'Data inserted successfully' });
        sendVerificationEmail(userid, verificationToken);
        // console.log("Verification token",verificationToken,userid);
        }
      });
     


    }
  });
});

app.get('/api/getRoleData', (req, res) => {
  const { organization } = req.query;
  

  const query = 'SELECT d.Department AS Department, r.Role AS Role, d.Organization AS Organization FROM organization_department d INNER JOIN organization_role r ON d.Organization = r.Organization WHERE d.Organization = ? ';

  db.query(query, [organization], (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    } 
    else if (results.length === 0) {
      console.error("No results found for organization:", organization);
      return res.status(401).json({ error: 'Invalid Organization Name' });
    } 
    else {
      const uniqueDepartments = new Set();
      const uniqueRoles = new Set();
      const uniqueOrganizations = new Set();

      const Department = [] ;
      const Role = [];
      const Organization = [];

      // Iterate through the array
      for (let i = 0; i < results.length; i++) {
        const data = results[i];

        // Check if the values are not already in the respective unique Sets
        if (!uniqueDepartments.has(data.Department)) {
          Department.push(data.Department);
          uniqueDepartments.add(data.Department);
        }

        if (!uniqueRoles.has(data.Role)) {
          Role.push(data.Role);
          uniqueRoles.add(data.Role);
        }

        if (!uniqueOrganizations.has(data.Organization)) {
          Organization.push(data.Organization);
          uniqueOrganizations.add(data.Organization);
        }
      }

      const result = {
        Department,
        Role,
        Organization
      };

      // Now, result contains unique arrays for 'Department', 'Role', and 'Organization'
      // console.log(result);

      res.json(result);
    }
  });
});






app.get('/api/ResendVerificationLink', (req, res) => {
  const email = req.query.Email;
  const verificationToken = uuidv4();


   



  sendVerificationEmailboolean(email, verificationToken, (error) => {
    if (error) {
      res.json({ success: false, message: 'Failed to send verification email' });
    } else {
      db.query('UPDATE clientadmin SET Emailtoken= ? WHERE Email=?',[verificationToken,email],(error,result)=>{ 

        if(result)
        {
          console.log("DB Updated")
          res.json({ success: true, message: 'Verification link sent successfully' });
        }


       });
      
    }
  });
});







//  check mail verified or not
app.get('/api/verify-email', (req, res) => {
  const { email, token } = req.query;


  const query='SELECT Emailtoken FROM clientadmin WHERE Email= ?';
  db.query(query, [email], (err, results) => {
    if(err)
    {
      // console.log("Verification status",error)
      return res.status(101).json("Email verification faild");

    }
    else{
       const tokendetails=results[0]
      if (tokendetails.Emailtoken === token) {
        // Update the user's status to mark their email as verified
        // user.isEmailVerified = true;

        db.query('UPDATE `clientadmin` SET `Emailverified`=? WHERE Email=?',[1,email],(err,result)=>{
          if(result)
          {
            return res.send(`
            <html>
            <body>
              <h1>Email Verified Successfully</h1>
              <p>All is set! You can now move to your dashboard.</p>
              <!-- You can add a button or link to navigate to the dashboard -->
              <a href="http://localhost:4200/">Go to Dashboard</a>
            </body>
            </html>
          `);
          }
          if(err)
          {
            return res.status(401).json("Email verified Successfull");
          }
        }
        );
        
      } 
      else {
        return res.status(401).json( 'Invalid verification token');
      }
      
    }

  });
  
});


function sendVerificationEmail(email, token) {
  const verificationLink = `http://localhost:3000/api/verify-email?email=${email}&token=${token}`;

  const mailOptions = {
    from: 'paplsoft.itservice@gmail.com',
    to: email,
    subject: 'Email Verification',
    html: `Click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email sending error:', error);
    }
     else {
      console.log('Email sent:', info.response);
    }
  });
}

function sendVerificationEmailboolean(email, token, callback) {
  const verificationLink = `http://localhost:3000/api/verify-email?email=${email}&token=${token}`;

  const mailOptions = {
    from: 'paplsoft.itservice@gmail.com',
    to: email,
    subject: 'Email Verification',
    html: `Click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email sending error:', error);
      callback(error);
    } else {
      console.log('Email sent:', info.response);
      callback(null);
    }
  });
}








// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *
// *



const db1 = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'papl_inspection',
});

// Connect to the MySQL database
db1.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});




//apis for inf 26

// Define a route to fetch values from MySQL
app.get('/api/building_type', (req, res) => {
  const query = 'SELECT building_name FROM type_of_building';

  db1.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching values from MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const values = results.map((row) => row.building_name);
    res.json(values);
  });
});


app.get('/api/region', (req, res) => {
    const query = 'SELECT region_name FROM region_details';
  
    db1.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching values from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const values = results.map((row) => row.region_name);
      res.json(values);
    });
  });

  app.get('/api/inspection_type', (req, res) => {
    const query = 'SELECT inspection_name FROM inspection_type';
  
    db1.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching values from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const values = results.map((row) => row.inspection_name);
      res.json(values);
    });
  });


  app.get('/api/oem', (req, res) => {
    const query = 'SELECT oem_name FROM oem_details';
  
    db1.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching values from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const values = results.map((row) => row.oem_name);
      res.json(values);
    });
  });

  app.get('/api/travel', (req, res) => {
    const query = 'SELECT type_of FROM travel_accomodation';
  
    db1.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching values from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const values = results.map((row) => row.type_of);
      res.json(values);
    });
  });
  




  app.get('/api/elevator_type', (req, res) => {
    const query = 'SELECT type FROM type_elevator';
  
    db1.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching values from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const values = results.map((row) => row.type);
      res.json(values);
    });
  });


  app.get('/api/elevator_usages', (req, res) => {
    const query = 'SELECT e_usage FROM elevator_usage';
  
    db1.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching values from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const values = results.map((row) => row.e_usage);
      res.json(values);
    });
  });

  //home drop dowm
  app.get('/api/home_type', (req, res) => {
    const query = 'SELECT home_type FROM home_type';
  
    db1.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching values from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const values = results.map((row) => row.home_type);
      res.json(values);
    });
  });


  app.get('/api/home_usages', (req, res) => {
    const query = 'SELECT home_usage FROM home_usage';
  
    db1.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching values from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const values = results.map((row) => row.home_usage);
      res.json(values);
    });
  });


  //dumb drop down
  app.get('/api/dumb_type', (req, res) => {
    const query = 'SELECT type_dumb FROM dumb_type';
  
    db1.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching values from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const values = results.map((row) => row.type_dumb);
      res.json(values);
    });
  });


  app.get('/api/dumb_usages', (req, res) => {
    const query = 'SELECT usage_dumb FROM dumb_usage';
  
    db1.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching values from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const values = results.map((row) => row.usage_dumb);
      res.json(values);
    });
  });


  //select inspector

  // app.get('/api/inspector', (req, res) => {
  //   const parsedUrl = url.parse(req.url);
  // const queryParams = querystring.parse(parsedUrl.query);

  // const oem = queryParams.oem;
  // const oemLocation = queryParams.oem_location;
  //   const query = 'SELECT inspector_name FROM insp_data';
  
  //   db.query(query, (err, results) => {
  //     if (err) {
  //       console.error('Error fetching values from MySQL:', err);
  //       res.status(500).json({ error: 'Internal Server Error' });
  //       return;
  //     }
  
  //     const values = results.map((row) => row.inspector_name);
  //     res.json(values);
  //   });


//   const parsedUrl = url.parse(req.url);
//   const queryParams = querystring.parse(parsedUrl.query);

//   const oem = queryParams.oem;
//   const oemLocation = queryParams.oem_location;
//   const papl_doj = queryParams.papl_doj; // Get the papl_doj parameter from the query parameters

//   const query = `
//     SELECT inspector_name 
//     FROM insp_data 
//     WHERE location_previousemp = 'MUMBAI' 
//     AND previous_employment = 'HITACHI' 
//     AND DATEDIFF(NOW(), STR_TO_DATE(papl_doj, '%Y-%m-%d')) > 730
//   `;

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching values from MySQL:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//       return;
//     }

//     const values = results.map((row) => row.inspector_name);
//     res.json(values);
//   });
// });
// In this modified code, the papl_doj parameter is extracted from the queryParams object. Ensure that the parameter papl_doj is being sent in the query string from the client side when making the GET request to this endpoint. Also, make sure that the papl_doj parameter is properly formatted in the 'YYYY-MM-DD' format in the query string.




// User
  // const papl_doj = queryParams.papl_doj; // Get the papl_doj parameter from the query parameters
// , i dont have a value for this, that value comes from mysql table

// const url = require('url');
// const querystring = require('querystring');

// app.get('/api/inspector', (req, res) => {
//   const parsedUrl = url.parse(req.url);
//   const queryParams = querystring.parse(parsedUrl.query);

//   const oem = queryParams.oem;
//   const oemLocation = queryParams.oem_location;

//   // Modify the SQL query to include papl_doj from the database table
//   const query = `
//   SELECT inspector_name, PAPL_DOJ 
//   FROM insp_data 
//   WHERE 
//       (location_previousemp = ? AND previous_employment = ?)
//       OR 
//       (location_previousemp <> ? OR previous_employment <> ?);
// `;

//   db.query(query, [oemLocation,oem,oemLocation,oem], (err, results) => {
//     if (err) {
//       console.error('Error fetching values from MySQL:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//       return;
//     }

//     // Filter the results based on the date condition
//     const filteredResults = results.filter(row => {
//       const doj = new Date(row.PAPL_DOJ);
//       const currentDate = new Date();
//       const diffInDays = Math.floor((currentDate - doj) / (1000 * 60 * 60 * 24)); // Calculate the difference in days
//       return diffInDays > 730;
//     });

//     const values = filteredResults.map(row => row.inspector_name);
//     res.json(values);
//   });
//   });

app.get('/api/inspector', (req, res) => {
  // const oem = req.query.oem;
  // const oemLocation = req.query.oem_location;

  // const encodedValue = req.query.encodedValue;

 
  // const query = `SELECT location, oem_details FROM inf_26 WHERE contract_number = '${encodedValue}'`;

  //   // Execute the database query
  //   db.query(query, (err, result) => {
  //       if (err) {
  //           // Handle database query error
  //           console.error(err);
  //           res.status(500).json({ error: 'Internal Server Error' });
  //       } else {
  //           // Extract location and oem from the database query result
  //           const location = result[0].location;
  //           const oem = result[0].oem_details;

  //           // Send the extracted data back to the client
  //           const responseObject = {
  //               encodedValue: encodedValue,
  //               location: location,
  //               oem: oem,
  //               message: 'Received data successfully'
  //           };
  //           res.json(responseObject);
  //       }
  //   });



  const encodedValue = req.query.encodedValue;

  // First query to get location and oem details
  const firstQuery = `SELECT location, oem_details FROM inf_26 WHERE contract_number = '${encodedValue}'`;

  // Execute the first database query
  db1.query(firstQuery, (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error (First Query)' });
      } else {
          const location = result[0].location;
          const oem = result[0].oem_details;


          // SELECT inspector_name, PAPL_DOJ FROM insp_data WHERE previous_employment = "${oem}" AND location_previousemp = "${location}" AND NOT DATE_ADD(PAPL_DOJ, INTERVAL 2 YEAR) <= NOW();
          // Second query based on the obtained oem value

          // SELECT inspector_name,PAPL_DOJ1 FROM insp_data WHERE (PAPL_DOJ1 IS NULL) OR (previous_employment = "${oem}" AND location_previousemp = "${location}" AND (PAPL_DOJ1 IS NOT NULL AND DATE_ADD(PAPL_DOJ1, INTERVAL 2 YEAR) <= NOW()));`;
          const secondQuery = `SELECT inspector_name, PSN,PAPL_DOJ FROM insp_data WHERE (previous_employment = "${oem}" AND location_previousemp = "${location}" AND DATE_ADD(PAPL_DOJ, INTERVAL 2 YEAR) <= NOW()) OR (previous_employment != "${oem}" OR location_previousemp != "${location}"); `;

          // Execute the second database query
          db1.query(secondQuery, (err, inspectorResult) => {
              if (err) {
                  console.error(err);
                  res.status(500).json({ error: 'Internal Server Error (Second Query)' });
              } else {
                  // Extract data from the second query result
                  const values = inspectorResult.map(row => row.inspector_name +' - '+row.PSN);

                  // Send the response back to the client with a structured format
                
                  res.json(values);
              }
          });
      }
  });
  
});



  //inspection time
  app.get('/api/inspection_time', (req, res) => {
    const query = 'SELECT time_shift FROM inspection_time';
  
    db1.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching values from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const values = results.map((row) => row.time_shift);
      res.json(values);
    });
  });


  //inspection time for ins

  app.get('/api/inspection_time_ins', (req, res) => {
    const query = 'SELECT inspection_time FROM inspection_time_ins';
  
    db1.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching values from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const values = results.map((row) => row.inspection_time);
      res.json(values);
    });
  });



  //inspector type api
  app.get('/api/inspector_type', (req, res) => {
    const query = 'SELECT inspector_type FROM inspector_type';
  
    db1.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching values from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const values = results.map((row) => row.inspector_type);
      res.json(values);
    });
  });

  //store inf26 form
  app.post('/api/store_data', (req, res) => {
    const { contractNumber,region,location,checked_count,checked_items,unchecked_count,unchecked_items,total_items,elevator_values,home,dump,pincode,master_customer,work_order_no,customer_name_workorder,project_name,building_name,building_type,inspection_type_sync,site_address,customer_contact_name,customer_contact_number,customer_contact_mailid,total_number_of_units,no_of_elevator,no_of_stops_elevator,no_of_escalator,no_of_travelator,no_of_mw,no_of_dw,no_of_stops_dw,no_of_home_elevator,no_of_stops_home_elevator,no_of_car_parking,travel_expenses_by,accomodation_by,	no_of_visits_as_per_work_order,no_of_mandays_as_per_work_order,total_units_schedule,balance_to_inspect,inspection_time,inspector_name,tpt6,tpt7,load_test,pmt,rope_condition,client_whatsapp_number,inspection_time_ins,schedule_from,schedule_to,customer_workorder_date, oem_details } = req.body;
    const query = 'INSERT INTO inf_26 (contract_number,region,location,checked_count,checked_items,unchecked_count,unchecked_items,total_items,elevator_values,home_elevator_values,dump_values,pincode,master_customer_name,customer_workorder_name,customer_name_as_per_work_order, project_name ,building_name,type_of_building,	type_of_inspection ,site_address, customer_contact_name,customer_contact_number,customer_contact_mailid ,total_number_of_units,no_of_elevator,no_of_stops_elevator,no_of_escalator,no_of_travelator,no_of_mw,no_of_dw,no_of_stops_dw ,no_of_home_elevator,no_of_stops_home_elevator,no_of_car_parking,travel_expenses_by,accomodation_by,	no_of_visits_as_per_work_order,no_of_mandays_as_per_work_order,total_units_schedule,balance_to_inspect,inspection_time,inspector_name,tpt6,tpt7,load_test,pmt,rope_condition,client_whatsapp_number,inspection_time_ins,schedule_from,schedule_to,customer_workorder_date,oem_details) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
  
    db1.query(query, [contractNumber,region,location,checked_count,JSON.stringify(checked_items),unchecked_count,JSON.stringify(unchecked_items),JSON.stringify(total_items),JSON.stringify(elevator_values),JSON.stringify(home),JSON.stringify(dump),pincode,master_customer,work_order_no,customer_name_workorder,project_name,building_name,building_type,inspection_type_sync,site_address,customer_contact_name,customer_contact_number,customer_contact_mailid,total_number_of_units,no_of_elevator,no_of_stops_elevator,no_of_escalator,no_of_travelator,no_of_mw,no_of_dw,no_of_stops_dw,no_of_home_elevator,no_of_stops_home_elevator,no_of_car_parking,travel_expenses_by,accomodation_by,no_of_visits_as_per_work_order,no_of_mandays_as_per_work_order,total_units_schedule,balance_to_inspect,inspection_time,inspector_name,tpt6,tpt7,load_test,pmt,rope_condition,client_whatsapp_number,inspection_time_ins,schedule_from,schedule_to,customer_workorder_date,oem_details], (err, result) => {
      if (err) {
        console.error('Error storeing values:', err);
        res.status(500).json({ error: 'Error storing values' });
      } else {
        console.log('success:', result);
        res.status(200).json({ message: 'data stored successfully successfully' });
      }
    });
  });

//api to store 
  app.post('/api/store_data1', (req, res) => {
    // const { contractNumber,region,location,elevator_values,home,dump,pincode,master_customer,work_order_no,customer_name_workorder,project_name,building_name,building_type,inspection_type_sync,site_address,customer_contact_name,customer_contact_number,customer_contact_mailid,total_number_of_units,no_of_elevator,no_of_stops_elevator,no_of_escalator,no_of_travelator,no_of_mw,no_of_dw,no_of_stops_dw,no_of_home_elevator,no_of_stops_home_elevator,no_of_car_parking,travel_expenses_by,accomodation_by,	no_of_visits_as_per_work_order,no_of_mandays_as_per_work_order,inspection_time,tpt6,tpt7,load_test,pmt,rope_condition,client_whatsapp_number,customer_workorder_date, oem_details } = req.body;
    const { contractNumber,region,location,checked_count,checked_items,unchecked_count,unchecked_items,total_items,elevator_values,home,dump,pincode,master_customer,work_order_no,customer_name_workorder,project_name,building_name,building_type,inspection_type_sync,site_address,customer_contact_name,customer_contact_number,customer_contact_mailid,total_number_of_units,no_of_elevator,no_of_stops_elevator,no_of_escalator,no_of_travelator,no_of_mw,no_of_dw,no_of_stops_dw,no_of_home_elevator,no_of_stops_home_elevator,no_of_car_parking,travel_expenses_by,accomodation_by,	no_of_visits_as_per_work_order,no_of_mandays_as_per_work_order,total_units_schedule,balance_to_inspect,inspection_time,inspector_name,tpt6,tpt7,load_test,pmt,rope_condition,callback,balance,client_whatsapp_number,inspection_time_ins,schedule_from,schedule_to,customer_workorder_date, oem_details,car_parking_values,escalator_values,mw_values,travelator_values,job_type } = req.body;

    const query = 'INSERT INTO inf_26 (contract_number, region, location, elevator_values, home_elevator_values, dump_values, pincode, master_customer_name, customer_workorder_name, customer_name_as_per_work_order, project_name ,building_name, type_of_building,	type_of_inspection ,site_address, customer_contact_name, customer_contact_number,customer_contact_mailid ,total_number_of_units,no_of_elevator,no_of_stops_elevator, no_of_escalator, no_of_travelator, no_of_mw ,no_of_dw, no_of_stops_dw ,no_of_home_elevator, no_of_stops_home_elevator,no_of_car_parking,travel_expenses_by,accomodation_by,	no_of_visits_as_per_work_order,no_of_mandays_as_per_work_order,inspection_time,tpt6,tpt7,load_test,pmt,rope_condition,callback,balance,client_whatsapp_number,customer_workorder_date,oem_details,car_parking_values,escalator_values,mw_values,travelator_values,job_type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
  
    db1.query(query, [contractNumber,region,location,JSON.stringify(elevator_values),JSON.stringify(home),JSON.stringify(dump),pincode,master_customer,work_order_no,customer_name_workorder,project_name,building_name,building_type,inspection_type_sync,site_address,customer_contact_name,customer_contact_number,customer_contact_mailid,total_number_of_units,no_of_elevator,no_of_stops_elevator,no_of_escalator,no_of_travelator,no_of_mw,no_of_dw,no_of_stops_dw,no_of_home_elevator,no_of_stops_home_elevator,no_of_car_parking,travel_expenses_by,accomodation_by,no_of_visits_as_per_work_order,no_of_mandays_as_per_work_order,inspection_time,tpt6,tpt7,load_test,pmt,rope_condition,callback,balance,client_whatsapp_number,customer_workorder_date,oem_details,JSON.stringify(car_parking_values),JSON.stringify(escalator_values),JSON.stringify(mw_values),JSON.stringify(travelator_values),job_type], (err, result) => {
      if (err) {
        console.error('Error storeing values:', err);
        res.status(500).json({ error: 'Error storing values' });
      } else {
        console.log('success:', result);
        res.status(200).json({ message: 'data stored successfully successfully' });
      }
    });
  });

  //sales when about V job
  app.post('/api/store_data2', (req, res) => {
    // const { contractNumber,region,location,elevator_values,home,dump,pincode,master_customer,work_order_no,customer_name_workorder,project_name,building_name,building_type,inspection_type_sync,site_address,customer_contact_name,customer_contact_number,customer_contact_mailid,total_number_of_units,no_of_elevator,no_of_stops_elevator,no_of_escalator,no_of_travelator,no_of_mw,no_of_dw,no_of_stops_dw,no_of_home_elevator,no_of_stops_home_elevator,no_of_car_parking,travel_expenses_by,accomodation_by,	no_of_visits_as_per_work_order,no_of_mandays_as_per_work_order,inspection_time,tpt6,tpt7,load_test,pmt,rope_condition,client_whatsapp_number,customer_workorder_date, oem_details } = req.body;
    const { contractNumber,region,location,checked_count,checked_items,unchecked_count,unchecked_items,total_items,elevator_values,home,dump,pincode,master_customer,work_order_no,customer_name_workorder,project_name,building_name,building_type,inspection_type_sync,site_address,customer_contact_name,customer_contact_number,customer_contact_mailid,total_number_of_units,no_of_elevator,no_of_stops_elevator,no_of_escalator,no_of_travelator,no_of_mw,no_of_dw,no_of_stops_dw,no_of_home_elevator,no_of_stops_home_elevator,no_of_car_parking,travel_expenses_by,accomodation_by,	no_of_visits_as_per_work_order,no_of_mandays_as_per_work_order,total_units_schedule,balance_to_inspect,inspection_time,inspector_name,tpt6,tpt7,load_test,pmt,rope_condition,callback,balance,client_whatsapp_number,inspection_time_ins,schedule_from,schedule_to,customer_workorder_date, oem_details,car_parking_values,escalator_values,mw_values,travelator_values,job_type } = req.body;

    const query = 'INSERT INTO inf_26 (contract_number, region, location, pincode, master_customer_name, customer_workorder_name, customer_name_as_per_work_order, project_name ,building_name, type_of_building,	type_of_inspection ,site_address, customer_contact_name, customer_contact_number,customer_contact_mailid ,travel_expenses_by,accomodation_by,	no_of_visits_as_per_work_order,no_of_mandays_as_per_work_order,inspection_time,tpt6,tpt7,load_test,pmt,rope_condition,callback,balance,client_whatsapp_number,customer_workorder_date,job_type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
  
    db1.query(query, [contractNumber,region,location,pincode,master_customer,work_order_no,customer_name_workorder,project_name,building_name,building_type,inspection_type_sync,site_address,customer_contact_name,customer_contact_number,customer_contact_mailid,travel_expenses_by,accomodation_by,no_of_visits_as_per_work_order,no_of_mandays_as_per_work_order,inspection_time,tpt6,tpt7,load_test,pmt,rope_condition,callback,balance,client_whatsapp_number,customer_workorder_date,job_type], (err, result) => {
      if (err) {
        console.error('Error storeing values:', err);
        res.status(500).json({ error: 'Error storing values' });
      } else {
        console.log('success:', result);
        res.status(200).json({ message: 'data stored successfully successfully' });
      }
    });
  });

   //inspection update for rest of details
   app.put('/api/update_data', (req, res) => {
    const {contractNumber,checked_count,checked_items,unchecked_count,unchecked_items,total_items,schedule_from,schedule_to,inspector_name,inspection_time_ins,total_units_schedule,balance_to_inspect,i_status,no_of_breakdays  } = req.body; // Assuming email is sent in the request body
  
    const query = 'UPDATE inf_26 SET checked_count = ?, checked_items=?, unchecked_count=?, unchecked_items=?,	total_items=?, inspection_time_ins=?, total_units_schedule=?, balance_to_inspect=?, schedule_from=?,schedule_to=?, inspector_list=? ,i_status=?, no_of_breakdays=? WHERE contract_number = ?';
  
    db1.query(query, [checked_count,JSON.stringify(checked_items),unchecked_count,JSON.stringify(unchecked_items),JSON.stringify(total_items),inspection_time_ins,total_units_schedule,balance_to_inspect,schedule_from,schedule_to,JSON.stringify(inspector_name),i_status,no_of_breakdays,contractNumber], (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Name not found' });
        } else {
          res.json({ message: 'Email updated successfully' });
        }
      }
    });
  });


  //p&e update
  app.put('/api/update_data1', (req, res) => {

    // elevator_values:elevator, 
    //   home:home_elevator, 
    //   dump:dump_elevator, 
    //   oem_details:this.oem_details_sync, 
    //   total_number_of_units:this.total_number_of_units, 
    //   no_of_elevator:no_of_elevator, 
    //   no_of_stops_elevator:no_of_stops_elevator, 
    //   no_of_escalator:no_of_escalator, 
    //   no_of_travelator:no_of_travelator, 
    //   no_of_mw:no_of_mw, 
    //   no_of_dw:no_of_dw, 
    //   no_of_stops_dw:no_of_stops_dw, 
    //   no_of_home_elevator:no_of_home_elevator, 
    //   no_of_stops_home_elevator:no_of_stops_home_elevator, 
    //   no_of_car_parking:no_of_car_parking, 
    //   car_parking_values:car_parking_values, 
    //   escalator_values:escalator_values, 
    //   mw_values:mw_values, 
    //   travelator_values:travelator_values, 

    const {contractNumber,elevator_values,home,dump,oem_details,total_number_of_units,no_of_elevator,no_of_stops_elevator,no_of_escalator,no_of_travelator,no_of_mw,no_of_dw, no_of_stops_dw,no_of_home_elevator,no_of_stops_home_elevator,no_of_car_parking,car_parking_values,escalator_values,mw_values,travelator_values,status } = req.body; // Assuming email is sent in the request body
  
    const query = 'UPDATE inf_26 SET 	oem_details = ?,total_number_of_units=?, no_of_elevator=?, no_of_stops_elevator=?, no_of_escalator=?, no_of_travelator=?, no_of_mw=?, no_of_dw=?, no_of_stops_dw=?, no_of_home_elevator=?, no_of_stops_home_elevator=?, no_of_car_parking=?,elevator_values=?, home_elevator_values=?, travelator_values=?, dump_values=?, car_parking_values=?,escalator_values=?, mw_values=?,status=? WHERE contract_number = ?';
  
    db1.query(query, [oem_details,total_number_of_units,no_of_elevator, no_of_stops_elevator,no_of_escalator,no_of_travelator,no_of_mw,no_of_dw,no_of_stops_dw, no_of_home_elevator,no_of_stops_home_elevator,no_of_car_parking,JSON.stringify(elevator_values),JSON.stringify(home),JSON.stringify(travelator_values),JSON.stringify(dump),JSON.stringify(car_parking_values),JSON.stringify(escalator_values),JSON.stringify(mw_values),status,contractNumber], (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Name not found' });
        } else {
          res.json({ message: 'Email updated successfully' });
        }
      }
    });
  });



  // const db1 = mysql.createPool({
  //   host: this.host,
  //   user: this.user,
  //   password: this.password,
  //   database: this.database,
  // });

  // app.post('/api/store_data', async (req, res) => {
  //   try {
  //     const { contractNumber, region, location } = req.body;
  
  //     // Insert data into the MySQL table, including the new field
  //     const [results] = await db1.query('INSERT INTO inf_26 (contract_number, region, location) VALUES (?, ?, ?)', [contractNumber, region, location]);
  
  //     console.log('Data inserted:', results);
  //     res.json({ message: 'Data inserted successfully' });
  //   } catch (error) {
  //     console.error('Error inserting data:', error);
  //     res.status(500).json({ error: 'An error occurred while storing data' });
  //   }
  // });

  //to get all contract number
  // app.get('/contract_no', (req, res) => {
  //   const query = 'SELECT contract_number FROM inf_26';
  
  //   db.query(query, (err, results) => {
  //     if (err) {
  //       console.error('Error executing SQL query:', err);
  //       res.status(500).json({ error: 'Internal Server Error' });
  //     } else {
  //       const names = results.map((row) => row.contract_number);
  //       res.json(names);
  //     }
  //   });
  // });
  // app.get('/contract_no', (req, res) => {
  //   let query = 'SELECT contract_number FROM inf_26 WHERE i_status=0';
  
  //   // Check if job_type parameter is provided in the request
  //   if (req.query.job_type && req.query.job_type === 'V') {
  //     query += ' WHERE job_type = ? AND status = ?';
  //     const values = ['V', 1];
  
  //     db.query(query, values, (err, results) => {
  //       if (err) {
  //         console.error('Error executing SQL query:', err);
  //         res.status(500).json({ error: 'Internal Server Error' });
  //       } else {
  //         const names = results.map((row) => row.contract_number);
  //         res.json(names);
  //       }
  //     });
  //   } else {
  //     // If job_type is not 'V', fetch all records
  //     db.query(query, (err, results) => {
  //       if (err) {
  //         console.error('Error executing SQL query:', err);
  //         res.status(500).json({ error: 'Internal Server Error' });
  //       } else {
  //         const names = results.map((row) => row.contract_number);
  //         res.json(names);
  //       }
  //     });
  //   }
  // });
  // app.get('/contract_no', (req, res) => {
  //   // const jobType = 'SELECT job_type from inf_26';
  //   let query = 'SELECT contract_number FROM inf_26 where i_status=0';
  //   console.log(jobType);
  
  //   if (jobType === 'V') {
  //     query += ' WHERE job_type = ? AND status = ? AND i_status=?';
  //     const values = ['V', 1 , 0];
  
  //     db.query(query, values, (err, results) => {
  //       if (err) {
  //         console.error('Error executing SQL query:', err);
  //         res.status(500).json({ error: 'Internal Server Error' });
  //       } else {
  //         const names = results.map((row) => row.contract_number);
  //         res.json(names);
  //       }
  //     });
  //   } else {
  //     db.query(query, (err, results) => {
  //       if (err) {
  //         console.error('Error executing SQL query:', err);
  //         res.status(500).json({ error: 'Internal Server Error' });
  //       } else {
  //         const names = results.map((row) => row.contract_number);
  //         res.json(names);
  //       }
  //     });
  //   }
  // });

  app.get('/contract_no', (req, res) => {
    // const query = 'SELECT contract_number FROM inf_26 where i_status=0';
    const query = "SELECT contract_number  FROM inf_26 WHERE i_status = 0 AND (    (job_type = 'V' AND status = '1')    OR job_type <> 'V');"
  
    db1.query(query, (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const names = results.map((row) => row.contract_number);
        res.json(names);
      }
    });
  });
  
  
  



  //select contract no for v jobs
  app.get('/contract_no1', (req, res) => {
    const query = 'SELECT contract_number FROM inf_26 where job_type="V" and status=0';
  
    db1.query(query, (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const names = results.map((row) => row.contract_number);
        res.json(names);
      }
    });
  });


  //get contract no corresponding details
  app.get('/details/:c_no', (req, res) => {
    const c_no = req.params.c_no;
    const query = 'SELECT * FROM inf_26 WHERE contract_number = ?';
  
    db1.query(query, [c_no], (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (results.length === 0) {
          console.log(err);
          res.status(404).json({ error: 'Name not found'});
        } else {
          const details = results[0]; // Assuming there's only one row with the name
          res.json(details);
        }
      }
    });
  });

  


  
  app.get('/api/job_type', (req, res) => {
    const query = 'SELECT job_type FROM job_type';
  
    db1.query(query, (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const names = results.map((row) => row.job_type);
        res.json(names);
      }
    });
  });












app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// app.listen(port, ipAddress, () => {
//   console.log(`Server is running on http://${ipAddress}:${port}`);
// });
// app.listen(port, '0.0.0.0', () => {
//   console.log(`Server is running on http://0.0.0.0:${port}`);
// });
    