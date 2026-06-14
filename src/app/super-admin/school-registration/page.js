"use client";

import { useState } from "react";

export default function SchoolRegistration() {
const [otpSent, setOtpSent] = useState(false);

const [school, setSchool] = useState({
schoolId: "",
schoolName: "",
udiseCode: "",
schoolType: "",
principalName: "",
contact: "",
email: "",
website: "",
address: "",
totalStudents: "",
totalTeachers: "",
password: "",
confirmPassword: "",
otp: "",
logo: null,
});

const handleChange = (e) => {
const { name, value, files } = e.target;

```
setSchool({
  ...school,
  [name]: files ? files[0] : value,
});
```

};

const sendOTP = () => {
if (!school.email) {
alert("Enter email first");
return;
}

```
setOtpSent(true);
alert("OTP Sent Successfully");
```

};

const handleSubmit = async (e) => {
e.preventDefault();

```
if (school.password !== school.confirmPassword) {
  alert("Passwords do not match");
  return;
}

console.log(school);

alert("School Registered Successfully");
```

};

return ( <div className="min-h-screen bg-slate-100 py-10 px-4">

```
  <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

    {/* Header */}

    <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-10">

      <h1 className="text-4xl font-bold text-center">
        School Registration Portal
      </h1>

      <p className="text-center mt-4 text-blue-100">
        Register your school and start managing students,
        teachers, attendance, examinations, fees and administration.
      </p>

    </div>

    {/* Form */}

    <form
      onSubmit={handleSubmit}
      className="p-8 md:p-10"
    >
      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <label className="font-semibold">
            School ID *
          </label>

          <input
            type="text"
            name="schoolId"
            value={school.schoolId}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border rounded-xl"
            placeholder="SCH001"
          />
        </div>

        <div>
          <label className="font-semibold">
            School Name *
          </label>

          <input
            type="text"
            name="schoolName"
            value={school.schoolName}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border rounded-xl"
            placeholder="ABC Public School"
          />
        </div>

        <div>
          <label className="font-semibold">
            UDISE Code *
          </label>

          <input
            type="text"
            name="udiseCode"
            value={school.udiseCode}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border rounded-xl"
            placeholder="Enter UDISE Code"
          />
        </div>

        <div>
          <label className="font-semibold">
            School Type *
          </label>

          <select
            name="schoolType"
            value={school.schoolType}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border rounded-xl"
          >
            <option value="">
              Select School Type
            </option>

            <option>
              Government
            </option>

            <option>
              Private
            </option>

            <option>
              Semi Government
            </option>

            <option>
              CBSE
            </option>

            <option>
              ICSE
            </option>

            <option>
              State Board
            </option>
          </select>
        </div>

        <div>
          <label className="font-semibold">
            Principal Name
          </label>

          <input
            type="text"
            name="principalName"
            value={school.principalName}
            onChange={handleChange}
            className="w-full mt-2 p-3 border rounded-xl"
          />
        </div>

        <div>
          <label className="font-semibold">
            Contact Number *
          </label>

          <input
            type="tel"
            name="contact"
            value={school.contact}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border rounded-xl"
          />
        </div>

        <div>
          <label className="font-semibold">
            Email *
          </label>

          <div className="flex gap-2 mt-2">

            <input
              type="email"
              name="email"
              value={school.email}
              onChange={handleChange}
              required
              className="flex-1 p-3 border rounded-xl"
            />

            <button
              type="button"
              onClick={sendOTP}
              className="bg-blue-600 text-white px-5 rounded-xl"
            >
              OTP
            </button>

          </div>
        </div>

        <div>
          <label className="font-semibold">
            OTP Verification *
          </label>

          <input
            type="text"
            name="otp"
            value={school.otp}
            onChange={handleChange}
            required={otpSent}
            className="w-full mt-2 p-3 border rounded-xl"
          />
        </div>

        <div>
          <label className="font-semibold">
            Total Students
          </label>

          <input
            type="number"
            name="totalStudents"
            value={school.totalStudents}
            onChange={handleChange}
            className="w-full mt-2 p-3 border rounded-xl"
          />
        </div>

        <div>
          <label className="font-semibold">
            Total Teachers
          </label>

          <input
            type="number"
            name="totalTeachers"
            value={school.totalTeachers}
            onChange={handleChange}
            className="w-full mt-2 p-3 border rounded-xl"
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-semibold">
            School Website
          </label>

          <input
            type="url"
            name="website"
            value={school.website}
            onChange={handleChange}
            className="w-full mt-2 p-3 border rounded-xl"
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-semibold">
            School Address *
          </label>

          <textarea
            rows="4"
            name="address"
            value={school.address}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border rounded-xl"
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-semibold">
            School Logo
          </label>

          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleChange}
            className="w-full mt-2 p-3 border rounded-xl"
          />
        </div>

        <div>
          <label className="font-semibold">
            Password *
          </label>

          <input
            type="password"
            name="password"
            value={school.password}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border rounded-xl"
          />
        </div>

        <div>
          <label className="font-semibold">
            Confirm Password *
          </label>

          <input
            type="password"
            name="confirmPassword"
            value={school.confirmPassword}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border rounded-xl"
          />
        </div>

      </div>

      <button
        type="submit"
        className="w-full mt-8 bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-4 rounded-xl text-lg font-semibold hover:scale-[1.01] transition"
      >
        Register School
      </button>
    </form>
  </div>
</div>


);
}
