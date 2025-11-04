import React from "react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* HEADER */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-3">About Karmachari</h1>
          <p className="text-blue-100 text-lg max-w-3xl mx-auto leading-relaxed">
            Empowering students in Kerala through part-time job opportunities under the Labour Department.
          </p>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">
          Introduction
        </h2>
        <p className="text-gray-700 leading-relaxed mb-6 text-justify">
          Majority of students in western countries are engaging in part time jobs and the project namely{" "}
          <strong>Karmachari</strong> intends to develop a similar culture among
          the students in Kerala for avoiding the various hardships faced by the
          students, in cooperation with the employers and educational
          institutions. The <strong>Labour Department</strong> will be a nodal
          agency to facilitate, manage and control the scheme.
        </p>

        <h2 className="text-2xl font-semibold text-blue-900 mb-4">
          Objective of the Scheme
        </h2>
        <p className="text-gray-700 leading-relaxed text-justify">
          This scheme helps students to find a suitable part-time job while they
          are studying. The Scheme enables them to meet their educational
          expenses, especially students from economically weaker sections of the
          society. This Scheme helps the students to engage in part-time jobs to
          earn and support their education on one side, and acquire skills
          guaranteeing employability on the other. It mitigates economic
          hardships of learning and enhances the adaptable efficiency of the
          learner.
        </p>

        {/* CTA BUTTON */}
        <div className="text-center mt-10">
          <Link
            to="/student/register"
            className="inline-block px-6 py-3 bg-blue-900 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
          >
            Register Now
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 bg-blue-50 text-sm text-gray-700">
        &copy; {new Date().getFullYear()} Kerala Labour Commissionerate — Karmachari. All Rights Reserved.
      </footer>
    </div>
  );
}
