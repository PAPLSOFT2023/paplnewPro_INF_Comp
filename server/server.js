const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const mysql1=require('mysql2/promise');
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
app.use(express.json()); 
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


// Firebase Next Link
const admin = require('firebase-admin');
const serviceAccount = require('./paplapplication-firebase-adminsdk-dlrxg-4adbf847ee.json');
const { error, log } = require('console');
const e = require('express');
// const { async } = require('rxjs');
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
const db1 = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'papl_inspection',
 });
const db_promise=mysql1.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'papl_inspection',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});



db.connect((err) => {
  if (err) {
    console.error('Error', err);
    return;
  }
   else {
    console.log('Connected to MySQL Papl Client Database');
  }
});

// Connect to the MySQL database
db1.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL Papl Inspection');
});





const TransporterData = () => {
  return new Promise((resolve, reject) => {
    db.execute('SELECT App_password, Email, Organization FROM mail_automation ', (error, result) => {
      if (error) {
        reject(error);
      } else {
        if (result.length === 0) {
          reject(new Error('User not found'));
        } else {
          const myObject = {
            user: result[0].Email,
            pass: result[0].App_password
          };
  
          resolve(myObject);
        }
      }
    });
  });
};














const sendVerificationEmail= async (email, token) => {
  try {
    
    let transporter;

    // Use await to wait for TransporterData to resolve
    const data = await TransporterData();

    transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: data.user,
        pass: data.pass,
      },
    });

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
      } else {
        console.log('Email sent:', info.response);
      }
    });
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};






// Resend verify Link
const sendVerificationEmailboolean= async (email, token, callback) => {
  try {
  
    let transporter;

    // Use await to wait for TransporterData to resolve
    const data = await TransporterData();

    transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: data.user,
        pass: data.pass,
      },
    });

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
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }
   catch (error) {
    console.error('Error sending email:', error.message);
  }
};




app.get('/api/getinfdata_forMail', (req, res) => {
  const { id } = req.query;

  // Step 1: Retrieve data from inf_26 table
  db1.query('SELECT  contract_number, location, master_customer_name, customer_workorder_name, customer_workorder_date, type_of_inspection, project_name, customer_contact_mailid, no_of_mandays_as_per_work_order, total_units_schedule, schedule_from, schedule_to, inspection_time_ins, inspector_list FROM inf_26 WHERE id=?',[id],(error,result)=>{

    if (error) {
      console.log("Error");
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
     else {
     
       result[0].inspector_list = JSON.parse(result[0].inspector_list).filter(item => item.trim() !== '');
        const originalDate = new Date(result[0].customer_workorder_date);

         const options = {
             year: 'numeric',
            month: '2-digit',
              day: '2-digit'
              };

        result[0].customer_workorder_date = new Intl.DateTimeFormat('en-US', options).format(originalDate);

        // result[0].schedule_from,
        const originalDate_schedulefrom = new Date(result[0].schedule_from);

        const options_schedulefrom = {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          weekday: 'long'
        };

        result[0].schedule_from = new Intl.DateTimeFormat('en-GB', options_schedulefrom).format(originalDate_schedulefrom);


        // To 
        const originalDate_scheduleto= new Date(result[0].schedule_to);

        const options_scheduleto = {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          weekday: 'long'
        };

        result[0].schedule_to = new Intl.DateTimeFormat('en-GB', options_scheduleto).format(originalDate_scheduleto);
       
        const inputString = result[0].inspection_time_ins;
        const regex = /\(([^)]+)\)/;
        const match = inputString.match(regex);

        if (match) {
          result[0].inspection_time_ins=match[1];
       } 



       return res.json(result)

      
      
      }
  });
}); 


// get Inspector data for mail table 
app.get('/api/getInspectordata_forMail', async (req, res) => {
  try {
    const { inspectors } = req.query;
    const regex = /\b\d+\b/g;

    const extractedNumbers_PSN = inspectors.match(regex);

    // console.log("-->", extractedNumbers_PSN);

    const resultsArray = await getinsp_Data_For_Inf(extractedNumbers_PSN);

    console.log('Final Results:', resultsArray);
    return res.json(resultsArray);
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


async function getinsp_Data_For_Inf(extractedNumbers_PSN) {
  const resultsArray = [];

  for (const inspector_PSN of extractedNumbers_PSN) {
    const query = 'SELECT `NAME`, `designation`, `contact_no`, `email_id` FROM `emp_data` WHERE `PSN_NO` = ?';

    try {
      const [rows, fields] = await db_promise.query(query, [inspector_PSN]);
      // Access the row data and push it into the resultsArray
      resultsArray.push(rows[0]);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      // You might want to handle the error accordingly, e.g., push an empty object or a placeholder value
      resultsArray.push({});
    }
  }

  // console.log("====>", resultsArray.length);
  return resultsArray;
}
 






app.get('/api/getMailSetupdata_forMail', (req, res) => {
  const { organization } = req.query;
  console.log(organization);

  db.query('SELECT App_password, Email FROM mail_automation WHERE Organization=?', [organization], (error, result) => {
   
    if (result.length > 0) {
      // Send the result as a JSON response to the client
      // console.log(result)
      return res.json(result);
    } else {
      // Send a response indicating that no data was found
      return res.status(404).json({ message: 'No data found for the organization' });
    }
  });
});



// getInspector_CV_data_forMail
app.get('/api/getInspector_CV_data_forMail', async (req, res) => {
  try {
    const { inspectors } = req.query;
    const regex = /\b\d+\b/g;

    const extractedNumbers_PSN_For_CV = inspectors.match(regex);

    // console.log("-->", extractedNumbers_PSN_For_CV);

     resultsArray_CV= await getinsp_CV_Data_For_Inf(extractedNumbers_PSN_For_CV);

    console.log('Final Results:', resultsArray_CV);
    return res.json(resultsArray_CV);
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function getinsp_CV_Data_For_Inf(extractedNumbers_PSN_For_CV) {
  const resultsArray = [];

  for (const inspector_PSN of extractedNumbers_PSN_For_CV) {
    const query = 'SELECT `pdf` FROM `pdf_cv` WHERE `PSN_NO`= ?';

    try {
      const [rows, fields] = await db_promise.query(query, [inspector_PSN]);

      // console.log(rows[0]);

      // Check if rows[0] exists and is not null before pushing to resultsArray
      if (rows[0] !== undefined && rows[0] !== null) {
        resultsArray.push(rows[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }

  // console.log("====>", resultsArray.length);

  return resultsArray;
}





// 
app.post('/api/sendmailtocli', async (req, res) => {
  const {
    customername,
    totalunit,
    projectname,
    location,
    contract_number,
    customer_workorder_name,
    from,
    to,
    noOfDays,
    inspectionType,
    inspectionTime,
    customerMail,
    emailIds_CC,
    inspectorData,
    appPassword,
    senderEmail,
    inspectors
  } = req.body;

  console.log("customer name", customername);
  
  try {
    // Handle the data from the request body
    // console.log(">>>>", customername, totalunit, projectname, location, from, to, noOfDays, inspectionType, inspectionTime, customerMail,inspectorData, appPassword, senderEmail, inspectors); 
    const extractedNumbers = [];
    const numberRegex = /-\s(\d+)/;
    inspectors.forEach((str) => {
      // Use the regular expression to match and extract the number
      const match = str.match(numberRegex);
      // If a match is found, push the extracted number to the array
      if (match && match[1]) {
        extractedNumbers.push(match[1]);
      }
    });
    const resultsArray_CV= await getinsp_CV_Data_For_Inf(extractedNumbers);
    let transporter;
    transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user:  senderEmail,
        pass: appPassword,
        
      },
      
    });
    
const generatePersonnelRows = (personnelArray) => {
  let slNo = 1;
  return personnelArray.map(person => {
   

    return `
      <tr>
      <td style="padding-left: 10px;">${slNo++}</td>
        <td style="padding-left: 10px;">${person[1]}</td>
        <td style="padding-left: 10px;">${person[3]}</td>
        <td style="padding-left: 10px;">${person[5]}</td>
        <td style="padding-left: 10px;">${person[7]}</td>
      </tr>
    `;
  }).join('');;
};


    const mailBody = `
    
    <p style="color: black;">Dear Sir/Madam,</p>
    <p style="color: black;">Kind Attention:<b> ${customername}</b> </p>
    <p style="color: black;">Thank you for your order for the inspection of <b>${totalunit} Units</b> at <b> ${projectname}-${location}</b></p>
    <p style="color: black;">Please note the following:-</p>
    <div style="padding-left: 20px;">
    <table width="600" height="20" border="1" >
        <tr>
            <td style="padding: 4px;" >PAPL Order Reference</td> <td style="padding: 4px;  font-weight:bold" colspan="4">${contract_number}</td></tr>
            <tr>
            <td style="padding: 4px;" >Customer Order Reference</td>
            <td style="padding: 4px;" colspan="4">${customer_workorder_name}</td>
        </tr>
        <tr>
           <td style="padding: 4px;" rowspan="2"> Proposed Inspection Dates</td>  <td style="padding: 4px;" rowspan="1" colspan="2">Inspection Start Date</td>
          <td style="padding: 4px;">${from}</td></tr>
          <tr>
          <td style="padding: 4px;">Inspection End Date</td><td style="padding: 4px;" rowspan="1" colspan="2">${to}</td>
        </tr>
        <tr>
            <td style="padding: 4px;">Total Number of Days</td > <td style="padding: 4px;" colspan="4">	${noOfDays} Days</td>
        </tr> 
        <tr>
            <td style="padding: 4px;" >Inspection Type</td>
            <td style="padding: 4px;" colspan="4">${inspectionType}</td>
        </tr>
        <tr>
            <td style="padding: 4px;" >Calibrated instruments carried by us</td>
            <td style="padding: 4px;" colspan="4">Metal Scale, Taper Scale, Measuring Tape</td>
        </tr>
    </table>
    </div>
    <br>
    <p style="color: black;"><b> The inspection will be carried out between ${inspectionTime}.</b></p>
    <p style="color: black;">The Inspection will be conducted by the following personnel (Credentials Attached) and request you kindly process the entry Pass accordingly.</p>
    <div style="padding-left: 20px;">
    <table border="1">
        <tr>
            <th>SL. NO</th>
            <th>NAME</th>
            <th>DESIGNATION</th>
            <th>MOBILE</th>
            <th>E-MAIL ID</th>
        </tr>
        
        
        ${generatePersonnelRows(inspectorData)}
        
    </table>
    </div>
    <br>
    <p style="color: black;">Representatives of OEM/ Service providers at the supervisory level with adequate manpower <b>(One Technical Person per Inspector)</b> and tools as listed below should be made available throughout the inspection for coordination and support.</p>
    <p style="color: black;">We need -: </p>
    <div style="padding-left: 20px;">
          <p style="color: black;">1. Permission to enter the premises</p>
    
        <p style="color: black;">2. Permission to travel on Equipment, enter the Pit, Car Top, and Machine Room. OEM/service provider or the building management should not object.</p>
    
        <p style="color: black;">3. Permission to carry Torch, Measuring tape, and other measuring instruments.</p>
    
        <p style="color: black;">4. Permission to record measurements and other findings as may be required.</p>
    
       <p style="color: black;">5. <u><b>Permission to carry a camera </b></u>and photograph the installation including the lobby, Elevator Pit, Elevator Machine fixing arrangements, Car top, floor landing fixtures, and any other space related to the equipment</p>
    </div>
    
       <p style="color: black;">The Following Tools and measuring instruments with <u>Valid Calibration Certificates from NABL Accredited laboratories, traceable to national/international references </u>should be made available by the OEM/Service Provider throughout the inspection.</p>
    <div style="padding-left: 20px;">
       <table border="1" width="200" >
        <tr >
           <td style="text-align: center; font-weight:bold" >TOOLS</td>
        </tr>
        <tr>
            <td style="text-align: center;">HANDLAMP</td>
        </tr>
        <tr>
            <td style="text-align: center;">HAND TOOLS</td>
        </tr>
        <tr>
            <td style="text-align: center;">DOOR OPEN KEYS</td>
        </tr>
    </table>
    </div>
    <br>
    <p style="color: black;">
        <b>This inspection shall be independent & impartial,</b> irrespective of any other engagement that PAPL Corp shall have with you. Please refer to our policy <a href="https://paplcorp.com/policy.html">(https://paplcorp.com/policy.html)</a> on the same for more information.
    
    Please email your feedback/ concerns/ complaints if any on the constitution of the inspector/s or any other issue about our engagement to <a href="info@paplcorp.com">info@paplcorp.com</a> the same shall be addressed on priority. Please refer to our policy on complaints and appeals <a href="https://paplcorp.com/policy-04.html">(https://paplcorp.com/policy-04.html)</a></p>
    <div >
    <p style="font-weight: bolder; color: black;">Note: This email is system-generated. For any clarifications, please feel free to contact the PAPL team. </p>
    </div>
    `;
    const attachments = resultsArray_CV.map((pdf, index) => {
      return {
        filename: `CV-attachment${index + 1}.pdf`,
        content: pdf.pdf.toString('base64')
      };
    });
   

    // console.log("000000", emailIds_CC)
    // console.log("attachment",attachments)
    const mailOptions = {
      from:senderEmail,
      to: customerMail, // Replace with the actual recipient email
      cc:emailIds_CC,
      subject:  "Elevators & Escalators Inspection,"+projectname,
      html: mailBody,
      attachments: attachments
    };


    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:',info.response);
    return res.json({ success: info.response });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});








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
        db.query('UPDATE `clientadmin` SET `Emailverified`=? WHERE Email=?',[1,email],(err,result)=>{
          if(result)
          {
            return res.send(`
            <html>
            <body>
              <h1>Email Verified Successfully</h1>
              <p style="color: black;">All is set! You can now move to your dashboard.</p>
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





app.get('/api/ResendVerificationLink', (req, res) => {
  const email = req.query.Email;
  const verificationToken = uuidv4();

  sendVerificationEmailboolean(email, verificationToken, (error) => {
    if (error) {
      res.json({ success: false, message: 'Failed to send verification email' });
    } 
    else {
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














// get INspector List from scheduled INF26
app.get('/api/Get_Insp_List',(req,res)=>{

 
    
    const query='SELECT `inspector_list` FROM `inf_26` WHERE 1 ';
    db1.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      } else {
        // Filter out empty values
        const filteredResults = results.filter((result) => {
          return result.inspector_list !== '[""]' && result.inspector_list !== null;
        });
    
        console.log("--------->", filteredResults);
        return res.json(filteredResults);
      }
    });
  });



// Get Leave Data For Inspection schedule from NExt Link
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
  console.log("server called",Email)
  const query='SELECT Email,Emailverified FROM clientadmin where Email= ? ';
  db.query(query,[Email],(err,results)=>{
if(err){

  return res.status(500).json({ error: 'Internal server error' });


} 
else {
 
  console.log(results)
  return res.json(results)
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
    else{
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
         let user_name="sam";
        const mail_status=user.Emailverified;

        // This is get the Inspector name From insp_data Database
        db1.query('SELECT inspector_name FROM `insp_data` WHERE emailid= ?  ',username,(err,result)=>{
          if(result)
          {
            // user_name=result[0].inspector_name;
            user_name=user.Username;

           
          }
          else{
            user_name=user.Username;
          }
          // console.log("Name from PAPL INSPECTION EMP",user_name)
          res.json({ token, status, role, organization,user_name,mail_status });
        })

        
      } 
      catch (error) {
        res.status(500).json({ error: 'Token creation failed' });
      }
    });
  }
  });
});



// get emp Profile data

app.get('/api/get_emp_data',(req,res)=>{
  const query='SELECT NAME,email_id,PSN_NO,designation,contact_no,date_of_joining,date_of_birth,dept FROM emp_data';
  db1.query(query,(err,results)=>{
    if(err)
    {
      console.log("Error accoured",err);
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
      console.log(Logineddata);
      res.json(Logineddata);


    }

  });

})
// update profiledata 
app.put('/api/update_profile',(req,res)=>{
  const {name ,email_id,PSN_NO,designation,contact_no,date_of_joining,date_of_birth,dept,existingemail}=req.body;

  db1.query('UPDATE emp_data SET NAME=? ,PSN_NO=?,designation=?,contact_no=?,email_id=?,date_of_joining=?,date_of_birth=?,dept=? WHERE email_id=? ',
  [name ,PSN_NO,designation,contact_no,email_id,date_of_joining,date_of_birth,dept,existingemail],(err,result)=>{

    if(err)
    {
      console.log("Error",err)
res.status(500).json({error:'internal server error'})
    }
    else{
      if(result.affectedRows===0)
      {
        console.log("Existing not found")
        res.status(404).json({error:'Existing data nit found'})
      }
      else{
        console.log("Update success")
        res.json({message:'Updated success'})

      }
    }
  })


 

// Add user in profiledata
app.post('/api/add_profile_data', (req, res) => {
  const userData = req.body;

  // Insert data into the MySQL database
  db.query('INSERT INTO emp_data SET ?', userData, (error, results) => {
    if (error) {
      console.error('MySQL insertion error:', error);
      res.status(500).json({ error: 'Error adding user' });
    } else {
      console.log('User added to MySQL:', results);
      res.status(200).json({ message: 'User added successfully' });
    }
  });
});



 





  
 })

// Your delete route
app.delete('/api/delete_emp_data', (req, res) => {
  console.log("server called");

  const { email_id } = req.body;

  if (!email_id) {
    return res.status(400).json({ error: 'Email ID is required' });
  }

  // Assuming 'db1' is your database connection object
  db1.query('DELETE FROM emp_data WHERE email_id=?', [email_id], (deleteErr, deleteResult) => {
    if (deleteErr) {
      console.error(deleteErr);
      return res.status(500).json({ error: 'Error deleting user' });
    }

    return res.status(200).json({ message: 'User deleted successfully++++' });
  });
});

//inspector cv database view //

app.put('/api/inspectorCv', (req, res) => {
  const query = 'SELECT email, pdf FROM pdf_cv'; 
  db.query(query, (err, results) => {
    if (err) {
      console.log('Error executing MySQL query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});



 
 






// software admin login Details update 
app.put('/api/adminregister_login_update', (req, res) => {
  const {email,organization,role,lstatus,authenticator,username,emailverified,existingmail,department } = req.body;
  const verificationToken = uuidv4();
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
      res.json(result);
    }
  });
});












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











// Select dump usage
app.get('/api/getDumpUsage',(req,res)=>{

  
 
  const query = 'SELECT usage_dumb FROM `dumb_usage` ';

  db1.query(query, (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    } 
     
    else {

    //  console.log("DUMP USAGE",results)
      res.json(results);
    }
  });
}
);
//  Insert dump usage
app.put('/api/addDump_Usage', (req, res) => {
  const { dump_usage } = req.body;
  console.log("Server called");

  const query = 'INSERT  INTO dumb_usage (usage_dumb) VALUES (?)';

  db1.query(query, [dump_usage], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.affectedRows === 0) {
        res.status(409).json({ error: 'Data already exists' });
      } else {
        res.json({ message: 'Data added successfully' });
      }
    }
  });
});
// delete dump iusage
app.delete('/api/DumpUsage_Data_Delete', (req, res) => {
  const {  dumpusage } = req.body;

  // Ensure that the organization and department are provided in the request body
  if ( !dumpusage) {
    return res.status(400).json({ error: 'Dump_Usage is required in the request body' });
  }

  db1.query("DELETE FROM dumb_usage WHERE usage_dumb=? ", [dumpusage], (err, result) => {
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



//  GET DUMP TYPE
app.get('/api/getDumpType',(req,res)=>{

  
 
  const query = 'SELECT type_dumb FROM `dumb_type` ';

  db1.query(query, (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    } 
    
    else {

     console.log("DUMP Type",results)
      res.json(results);
    }
  });
}
);

//  Insert dump type
app.put('/api/addDump_Type', (req, res) => {
  const { dump_type } = req.body;
  console.log("Server called");

  const query = 'INSERT  INTO dumb_type (type_dumb) VALUES (?)';

  db1.query(query, [dump_type], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.affectedRows === 0) {
        res.status(409).json({ error: 'Data already exists' });
      } else {
        res.json({ message: 'Data added successfully' });
      }
    }
  });
});

// delete dumb type
app.delete('/api/DumpType_Data_Delete', (req, res) => {
  const {  dumptype } = req.body;

 
  if ( !dumptype    ) {
    return res.status(400).json({ error: 'Value is required in the request body' });
  }

  db1.query("DELETE FROM dumb_type WHERE type_dumb=? ", [dumptype], (err, result) => {
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


// Get home type
app.get('/api/getHomeType',(req,res)=>{

  
 
  const query = 'SELECT home_type FROM `home_type` ';

  db1.query(query, (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    } 
    
    else {

     console.log("DUMP Type",results)
      res.json(results);
    }
  });
}
);

// insert home type 
app.put('/api/addHome_Type', (req, res) => {
  const { home_type } = req.body;
  console.log("Server called");

  const query = 'INSERT  INTO home_type (home_type) VALUES (?)';

  db1.query(query, [home_type], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.affectedRows === 0) {
        res.status(409).json({ error: 'Data already exists' });
      } else {
        res.json({ message: 'Data added successfully' });
      }
    }
  });
});

// delete home type
app.delete('/api/HomeType_Data_Delete', (req, res) => {
  const {  hometype } = req.body;

 
  if ( !hometype    ) {
    return res.status(400).json({ error: 'Value is required in the request body' });
  }

  db1.query("DELETE FROM home_type WHERE home_type=? ", [hometype], (err, result) => {
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

// getHomeUsage

app.get('/api/getHomeUsage',(req,res)=>{

  
 
  const query = 'SELECT home_usage FROM `home_usage` ';

  db1.query(query, (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    } 
    
    else {

     console.log("DUMP Type",results)
      res.json(results);
    }
  });
}
);
// addHome_Usage


app.put('/api/addHome_Usage', (req, res) => {
  const { home_usage } = req.body;
  console.log("Server called");

  const query = 'INSERT  INTO home_usage (home_usage) VALUES (?)';

  db1.query(query, [home_usage], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.affectedRows === 0) {
        res.status(409).json({ error: 'Data already exists' });
      } else {
        res.json({ message: 'Data added successfully' });
      }
    }
  });
});
// HomeUsage_Data_Delete

app.delete('/api/HomeUsage_Data_Delete', (req, res) => {
  const {  homeusage } = req.body;

 
  if ( !homeusage    ) {
    return res.status(400).json({ error: 'Value is required in the request body' });
  }

  db1.query("DELETE FROM home_usage WHERE home_usage=? ", [homeusage], (err, result) => {
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
// get_Ins_Time_Data

app.get('/api/get_Ins_Time_Data',(req,res)=>{

  
 
  const query = 'SELECT time_shift FROM `inspection_time` ';

  db1.query(query, (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    } 
    
    else {

     console.log("DUMP Type",results)
      res.json(results);
    }
  });
}
);


// addIns_time


app.put('/api/addIns_time', (req, res) => {
  const { ins_time } = req.body;
  console.log("Server called");

  const query = 'INSERT  INTO inspection_time (time_shift) VALUES (?)';

  db1.query(query, [ins_time], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.affectedRows === 0) {
        res.status(409).json({ error: 'Data already exists' });
      } else {
        res.json({ message: 'Data added successfully' });
      }
    }
  });
});
// delete_Ins_time_Data1


app.delete('/api/delete_Ins_time_Data1', (req, res) => {
  const {  Ins_time } = req.body;

 
  if ( !Ins_time    ) {
    return res.status(400).json({ error: 'Value is required in the request body' });
  }

  db1.query("DELETE FROM inspection_time WHERE time_shift=? ", [Ins_time], (err, result) => {
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


//  get_Ins_Time_Insp_Data


app.get('/api/get_Ins_Time_Insp_Data',(req,res)=>{

  
 
  const query = 'SELECT inspection_time FROM `inspection_time_ins` ';

  db1.query(query, (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    } 
    
    else {

     console.log("DUMP Type",results)
      res.json(results);
    }
  });
}
);
//  add ins_time_insp


app.put('/api/ins_time_insp', (req, res) => {
  const { ins_time_insp } = req.body;
  console.log("Server called");

  const query = 'INSERT  INTO inspection_time_ins (inspection_time) VALUES (?)';

  db1.query(query, [ins_time_insp], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.affectedRows === 0) {
        res.status(409).json({ error: 'Data already exists' });
      } else {
        res.json({ message: 'Data added successfully' });
      }
    }
  });
});


// delete_Ins_time_insp_Data1


app.delete('/api/delete_Ins_time_insp_Data1', (req, res) => {
  const {  Ins_time_insp } = req.body;

 
  if ( !Ins_time_insp    ) {
    return res.status(400).json({ error: 'Value is required in the request body' });
  }

  db1.query("DELETE FROM inspection_time_ins WHERE inspection_time=? ", [Ins_time_insp], (err, result) => {
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
// get_OEM_Data


app.get('/api/get_OEM_Data',(req,res)=>{

  
 
  const query = 'SELECT oem_name FROM `oem_details` ';

  db1.query(query, (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    } 
    
    else {

     console.log("DUMP Type",results)
      res.json(results);
    }
  });
}
);

// add oem_details

app.put('/api/oem_details', (req, res) => {
  const { oem_details } = req.body;
  console.log("Server called");

  const query = 'INSERT  INTO oem_details (oem_name) VALUES (?)';

  db1.query(query, [oem_details], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.affectedRows === 0) {
        res.status(409).json({ error: 'Data already exists' });
      } else {
        res.json({ message: 'Data added successfully' });
      }
    }
  });
});


// delete_OEM_Data1


app.delete('/api/delete_OEM_Data1', (req, res) => {
  const {  OEM } = req.body;

 
  if ( !OEM    ) {
    return res.status(400).json({ error: 'Value is required in the request body' });
  }

  db1.query("DELETE FROM oem_details WHERE oem_name =? ", [OEM], (err, result) => {
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

// get_Region_Details

app.get('/api/get_Region_Details',(req,res)=>{

  
 
  const query = 'SELECT region_name FROM `region_details` ';

  db1.query(query, (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    } 
    
    else {

     console.log("DUMP Type",results)
      res.json(results);
    }
  });
}
);
// add region_details


app.put('/api/region_details', (req, res) => {
  const { region_details } = req.body;
  console.log("Server called");

  const query = 'INSERT  INTO region_details (region_name) VALUES (?)';

  db1.query(query, [region_details], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.affectedRows === 0) {
        res.status(409).json({ error: 'Data already exists' });
      } else {
        res.json({ message: 'Data added successfully' });
      }
    }
  });
});
// delete_Region_Data1

app.delete('/api/delete_Region_Data1', (req, res) => {
  const {  Region } = req.body;

 
  if ( !Region    ) {
    return res.status(400).json({ error: 'Value is required in the request body' });
  }

  db1.query("DELETE FROM region_details WHERE region_name =? ", [Region], (err, result) => {
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
// get_Travel_Acc_Details


app.get('/api/get_Travel_Acc_Details',(req,res)=>{

  
 
  const query = 'SELECT type_of FROM `travel_accomodation` ';

  db1.query(query, (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    } 
    
    else {

     console.log("DUMP Type",results)
      res.json(results);
    }
  });
}
);

// addToTravel_Acc_Details



app.put('/api/addToTravel_Acc_Details', (req, res) => {
  const { Travel_Acc_details } = req.body;
  console.log("Server called");

  const query = 'INSERT  INTO travel_accomodation (type_of) VALUES (?)';

  db1.query(query, [Travel_Acc_details], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.affectedRows === 0) {
        res.status(409).json({ error: 'Data already exists' });
      } else {
        res.json({ message: 'Data added successfully' });
      }
    }
  });
});
// delete_Travel_Acc_Data1

app.delete('/api/delete_Travel_Acc_Data1', (req, res) => {
  const {  Region } = req.body;
console.log("SErver********** ",Region)
 
  if ( !Region    ) {
    return res.status(400).json({ error: 'Value is required in the request body' });
  }

  db1.query("DELETE FROM travel_accomodation WHERE type_of = ? ", [Region], (err, result) => {
    if (err) {
      // console.log("err ",Region)
      return res.status(500).json({ error: 'Internal server error' });
    } else {
      if (result.affectedRows > 0) {
        // console.log("Deletesucc ",Region)
        return res.json({ message: 'Delete Successful' });
      } else {
        // console.log("Not found ",Region)
        return res.status(404).json({ error: 'Data not found for deletion' });
      }
    }
  });
});

// get_Type_Ele_Details


app.get('/api/get_Type_Ele_Details',(req,res)=>{

  
 
  const query = 'SELECT type FROM `type_elevator` ';

  db1.query(query, (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    } 
    
    else {

     console.log("DUMP Type",results)
      res.json(results);
    }
  });
}
);

// addToType_EleDetails

app.put('/api/addToType_EleDetails', (req, res) => {
  const { Travel_Acc_details } = req.body;
  console.log("Server called");

  const query = 'INSERT  INTO type_elevator (type) VALUES (?)';

  db1.query(query, [Travel_Acc_details], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.affectedRows === 0) {
        res.status(409).json({ error: 'Data already exists' });
      } else {
        res.json({ message: 'Data added successfully' });
      }
    }
  });
});

// delete_Type_ele_Data1


app.delete('/api/delete_Type_ele_Data1', (req, res) => {
  const {  Region } = req.body;

 
  if ( !Region    ) {
    return res.status(400).json({ error: 'Value is required in the request body' });
  }

  db1.query("DELETE FROM type_elevator WHERE type =? ", [Region], (err, result) => {
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

// get_Type_Bul_Details
app.get('/api/get_Type_Bul_Details',(req,res)=>{

  
 
  const query = 'SELECT building_name FROM `type_of_building` ';

  db1.query(query, (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    } 
    
    else {

     console.log("DUMP Type",results)
      res.json(results);
    }
  });
}
);

// addToType_BulDetails
app.put('/api/addToType_BulDetails', (req, res) => {
  const { Travel_Acc_details } = req.body;
  console.log("Server called");

  const query = 'INSERT  INTO type_of_building (building_name) VALUES (?)';

  db1.query(query, [Travel_Acc_details], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.affectedRows === 0) {
        res.status(409).json({ error: 'Data already exists' });
      } else {
        res.json({ message: 'Data added successfully' });
      }
    }
  });
});

// delete_Type_Bul_Data1
app.delete('/api/delete_Type_Bul_Data1', (req, res) => {
  const {  Region } = req.body;

 
  if ( !Region    ) {
    return res.status(400).json({ error: 'Value is required in the request body' });
  }

  db1.query("DELETE FROM type_of_building WHERE building_name =? ", [Region], (err, result) => {
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
// Get Home USAGE FROM DB
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

  //rejection reason api
  app.get('/api/rejection', (req, res) => {
    const query = 'SELECT reject FROM rejects';
  
    db1.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching values from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const values = results.map((row) => row.reject);
      res.json(values);
    });
  });

// Get Dumb Usage from DB
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

app.get('/api/inspector', (req, res) => {




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
    const {contractNumber,checked_count,checked_items,unchecked_count,unchecked_items,total_items,schedule_from,schedule_to,inspector_name,inspection_time_ins,total_units_schedule,balance_to_inspect,i_status,no_of_breakdays ,inspector_array } = req.body; // Assuming email is sent in the request body
  
    const query = 'UPDATE inf_26 SET checked_count = ?, checked_items=?, unchecked_count=?, unchecked_items=?,	total_items=?, inspection_time_ins=?, total_units_schedule=?, balance_to_inspect=?, schedule_from=?,schedule_to=?, inspector_list=? ,i_status=?, no_of_breakdays=?, inspector_array=? WHERE contract_number = ?';
  
    db1.query(query, [checked_count,JSON.stringify(checked_items),unchecked_count,JSON.stringify(unchecked_items),JSON.stringify(total_items),inspection_time_ins,total_units_schedule,balance_to_inspect,schedule_from,schedule_to,JSON.stringify(inspector_name),i_status,no_of_breakdays,JSON.stringify(inspector_array),contractNumber], (err, result) => {
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

 

  app.get('/api/countRecords', (req, res) => {
    const { name } = req.query;
    console.log(name);
  
    // Construct the SQL query to check if 'name' exists within 'inspector_like' JSON array
    let sqlQuery = `SELECT COUNT(*) AS count FROM inf_26 WHERE JSON_CONTAINS(inspector_list, ${db1.escape(`"${name}"`)}) and i_approved=0 and i_rejected=0`;
  
    db1.query(sqlQuery, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Error fetching record count' });
      } else {
        const count = results[0].count;
        console.log(count);
        res.status(200).json(count);
      }
    });
  });

  app.get('/api/countRecords1', (req, res) => {
    const { name } = req.query;
    console.log(name);
  
    // Construct the SQL query to check if 'name' exists within 'inspector_like' JSON array
    let sqlQuery = `SELECT * FROM inf_26 WHERE JSON_CONTAINS(inspector_list, ${db1.escape(`"${name}"`)}) and i_approved=0 and i_rejected=0`;
  
    db1.query(sqlQuery, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Error fetching record count' });
      } else {
       
        res.status(200).json(results);
      }
    });
  });

  app.get('/api/countRecords2', (req, res) => {
    const { name } = req.query;
    console.log(name);
  
    // Construct the SQL query to check if 'name' exists within 'inspector_like' JSON array
    let sqlQuery = `SELECT * FROM inf_26 WHERE JSON_CONTAINS(inspector_list, ${db1.escape(`"${name}"`)}) and i_approved=1`;
  
    db1.query(sqlQuery, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Error fetching record count' });
      } else {
       
        res.status(200).json(results);
      }
    });
  });

  //reschedule request 
  app.get('/api/countRecords3', (req, res) => {
    const { name } = req.query;
    console.log(name);
  
    // Construct the SQL query to check if 'name' exists within 'inspector_like' JSON array
    let sqlQuery = `SELECT * FROM inf_26 WHERE i_rejected=1`;
  
    db1.query(sqlQuery, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Error fetching record count' });
      } else {
       
        res.status(200).json(results);
      }
    });
  });

  


  // app.get('/api/approveRecords', (req, res) => {
  //   const { id } = req.query;
  //   console.log('id is ',id);
  
  //   // Construct the SQL query to check if 'name' exists within 'inspector_like' JSON array
  //   let sqlQuery = `UPDATE inf_26 SET i_approved = ? where id=?`;
  
  //   db1.query(sqlQuery,[1,id] ,(error, results) => {
  //     if (error) {
  //       res.status(500).json({ error: 'Error fetching record count' });
  //     } else {
       
  //       res.status(200).json(results);
  //     }
  //   });
  // });

  app.put('/api/approveRecords', (req, res) => {
    const { id } = req.query;
    console.log('id is ', id);
  
    // Construct the SQL query with parameter placeholders
    let sqlQuery = 'UPDATE inf_26 SET i_approved = ? WHERE id = ?';
  
    // Use parameterized queries to prevent SQL injection
    db1.query(sqlQuery, [1, id], (error, results) => {
      if (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ error: 'Error updating record' });
      } else {
        res.status(200).json({ message: 'Record approved successfully' });
      }
    });
  });
  

  // app.put('/api/approveRecords3', (req, res) => {
  //   const { id,reason,name } = req.query;
  //   const combine = {name:name,reason:reason};
  
  //   console.log('id is ', id);
  //   console.log('name is',combine);
  
  //   // Construct the SQL query with parameter placeholders
  //   let sqlQuery = 'UPDATE inf_26 SET i_rejected = ?,reason=?,name_reason=? WHERE id = ?';
  
  //   // Use parameterized queries to prevent SQL injection
  //   db1.query(sqlQuery, [1, reason,JSON.stringify(combine),id], (error, results) => {
  //     if (error) {
  //       console.error('Error updating record:', error);
  //       res.status(500).json({ error: 'Error updating record' });
  //     } else {
  //       res.status(200).json({ message: 'Record approved successfully' });
  //     }
  //   });
  // });


  app.put('/api/approveRecords3', (req, res) => {
    const { id, reason, name } = req.query;
  
    // Construct the SQL query to retrieve the existing JSON data
    let selectQuery = 'SELECT name_reason FROM inf_26 WHERE id = ?';
  
    db1.query(selectQuery, [id], (selectError, selectResults) => {
      if (selectError) {
        console.error('Error retrieving record:', selectError);
        res.status(500).json({ error: 'Error retrieving record' });
      } else {
        let existingData = selectResults[0].name_reason || '{}'; // Get existing data or initialize an empty object if none
  
        // Parse the existing JSON string
        let existingObject = JSON.parse(existingData);
  
        // Add a new key-value pair to the existing object
        existingObject[name] = reason;
  
        // Convert the updated object back to a JSON string
        let updatedData = JSON.stringify(existingObject);
  
        // Construct the SQL query to update the record with the modified JSON string
        let updateQuery = 'UPDATE inf_26 SET i_rejected = ?, reason = ?, name_reason = ? WHERE id = ?';
  
        // Use parameterized queries to prevent SQL injection
        db1.query(updateQuery, [1, reason, updatedData, id], (updateError, updateResults) => {
          if (updateError) {
            console.error('Error updating record:', updateError);
            res.status(500).json({ error: 'Error updating record' });
          } else {
            res.status(200).json({ message: 'Record approved successfully' });
          }
        });
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
    