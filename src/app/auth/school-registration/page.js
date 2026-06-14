"use client";

import { useState } from "react";

export default function SchoolRegistration() {
const [otpSent, setOtpSent] = useState(false);

const [school, setSchool] = useState({

schoolName: "",
subdomain: "",
udiseCode: "",
schoolType: "",
adminName: "",
contact: "",
email: "",
villageCity: "",
district: "",
state: "",
address: "",
pinCode: "",
password: "",
confirmPassword: "",
otp: "",
logo: null,
subcriptionPlan:""
});

const handleChange = (e) => {
const { name, value, files } = e.target;


setSchool({
  ...school,
  [name]: files ? files[0] : value,
});


};

const sendOTP = () => {
if (!school.email) {
alert("Enter email first");
return;
}


setOtpSent(true);
alert("OTP Sent Successfully");


};

const handleSubmit = async (e) => {
e.preventDefault();


if (school.password !== school.confirmPassword) {
  alert("Passwords do not match");
  return;
}

console.log(school);

alert("School Registered Successfully");


};

return ( <div className="min-h-screen bg-slate-100 py-10 px-4">


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
      <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
  <span className="text-2xl">🔒</span>

  <div>
    <p className="font-semibold text-green-700">
      Secure Registration
    </p>

    <p className="text-sm text-gray-600">
      Your information is protected using industry-standard encryption.
    </p>
  </div>
</div>

      <div className="grid md:grid-cols-2 gap-6">

        

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
            School Subdomain *
          </label>

          <input
            type="text"
            name="subdomain"
            value={school.subdomain}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border rounded-xl"
            placeholder="abc_public_school_bhopal"
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
            Admin Name
          </label>

          <input
            type="text"
            name="adminName"
            value={school.adminName}
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
            State
          </label>

          <input
            type="text"
            name="state"
            value={school.state}
            onChange={handleChange}
            className="w-full mt-2 p-3 border rounded-xl"
          />
        </div>

        <div>
          <label className="font-semibold">
            District
          </label>

          <input
            type="text"
            name="district"
            value={school.district}
            onChange={handleChange}
            className="w-full mt-2 p-3 border rounded-xl"
          />
        </div>

        
        <div>
          <label className="font-semibold">
            Village/City
          </label>

          <input
            type="text"
            name="villageCity"
            value={school.villageCity}
            onChange={handleChange}
            className="w-full mt-2 p-3 border rounded-xl"
          />
        </div>

        <div>
          <label className="font-semibold">
            Pin Code *
          </label>

          <input
            type="text"
            name="pinCode"
            value={school.pinCode}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border rounded-xl"
            placeholder="Pin Code"
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
        <p className="text-sm text-gray-500 mt-2">
  Password must contain at least 8 characters,
  one uppercase letter and one number.
</p>

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


        <div>
          <label className="font-semibold">
            School Type *
          </label>

          <select
            name="subscriptionType"
            value={school.subscriptionType}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border rounded-xl"
          >
            <option value="">
              Select Subscription Type
            </option>

            <option>
              Up to 100 Students
            </option>

            <option>
              101 - 250 Students
            </option>

            <option>
              251 - 500 Students
            </option>

            <option>
              500 - 1000 Students
            </option>

            <option>
              More than 1000
            </option>

          </select>
        </div>

      </div>

      <div className="mt-8">
  <label className="flex items-start gap-3">
    <input
      type="checkbox"
      required
      className="mt-1"
    />

    <span className="text-sm text-gray-600">
      I agree to the{" "}
      <a
        href="/terms"
        className="text-blue-600 font-medium"
      >
        Terms of Service
      </a>{" "}
      and{" "}
      <a
        href="/privacy"
        className="text-blue-600 font-medium"
      >
        Privacy Policy
      </a>.
    </span>
  </label>
</div>

      <button
        type="submit"
        className="w-full mt-8 bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-4 rounded-xl text-lg font-semibold hover:scale-[1.01] transition"
      >
        Register School
      </button>
      <div className="text-center mt-6">
  <p className="text-gray-600">
    Already have an account?{" "}
    <a
      href="/auth/school-login"
      className="text-blue-700 font-semibold hover:underline"
    >
      Sign In
    </a>
  </p>
</div>
    </form>

    <div className="border-t mt-10 pt-8">
  <div className="grid md:grid-cols-3 gap-5 text-center">

    <div>
      <div className="text-3xl">⚡</div>
      <h3 className="font-semibold mt-2">
        Quick Setup
      </h3>
      <p className="text-sm text-gray-500">
        Start your school workspace in minutes.
      </p>
    </div>

    <div>
      <div className="text-3xl">🔒</div>
      <h3 className="font-semibold mt-2">
        Secure Platform
      </h3>
      <p className="text-sm text-gray-500">
        Encrypted data and role-based access.
      </p>
    </div>

    <div>
      <div className="text-3xl">☁️</div>
      <h3 className="font-semibold mt-2">
        Cloud Based
      </h3>
      <p className="text-sm text-gray-500">
        Access from anywhere, anytime.
      </p>
    </div>

  </div>
</div>
  </div>
</div>


);
}
