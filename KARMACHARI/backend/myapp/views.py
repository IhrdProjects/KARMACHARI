# views.py

from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Student_Registration,Officials_Registration,Employer_Registration,Vacancy, SchoolRegistration, Company_Registration,JobApplication, Commission_Registration, ALO_Registration, DLO_Registration
from .serializers import StudentRegistrationSerializer,OfficialsRegistrationSerializer,VacancySerializer, EmployerRegistrationSerializer, SchoolRegistrationSerializer,JobApplicationSerializer, CompanyRegistrationSerializer, CommissionRegistrationSerializer, ALORegistrationSerializer, DLORegistrationSerializer

@api_view(['GET', 'POST'])
def student_reg(request):
    if request.method == 'GET':
        students = Student_Registration.objects.all()
        serializer = StudentRegistrationSerializer(students, many=True)
        return Response(serializer.data)
    
    if request.method == 'POST':
        serializer = StudentRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

@api_view(['GET', 'PUT'])
def student_detail(request, enrollment):
    try:
        student = Student_Registration.objects.get(enrollment=enrollment)
    except Student_Registration.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)

    if request.method == 'GET':
        serializer = StudentRegistrationSerializer(student)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = StudentRegistrationSerializer(student, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    

@api_view(['GET'])
def student_by_school(request, name):
    students = Student_Registration.objects.filter(school_name=name)
    if not students.exists():
        return Response({"error": "No students found for this school"}, status=404)

    serializer = StudentRegistrationSerializer(students, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def student_login(request):
    # Log incoming request for debugging
    print("Request data:", request.data)

    enrollment = request.data.get('enrollment')
    password = request.data.get('password')

    # if not enrollment or not password:
    #     return Response({"error": "Enrollment and password are required"}, status=400)

    try:
        student = Student_Registration.objects.get(enrollment=enrollment, password=password)
        # print("student data:", student)
        serializer = StudentRegistrationSerializer(student)
        return Response({
            "message": "Login successful",
            "user": serializer.data
        })
    except Student_Registration.DoesNotExist:
        # 400 response if student not found
        return Response({
            "error": "Invalid enrollment or password"
        }, status=400)
    # except Exception as e:
    #     # catch-all error
    #     return Response({"error": str(e)}, status=500)


@api_view(['GET'])
def student_profile(request, enrollment):
    try:
        student = Student_Registration.objects.get(enrollment=enrollment)
        serializer = StudentRegistrationSerializer(student)
        return Response(serializer.data)
    except Student_Registration.DoesNotExist:
        return Response({'error': 'Student not found'}, status=404)


# @api_view(["PATCH"])
# def update_student_enrollment(request, enrollment):
#     try:
#         app = JobApplication.objects.get(enrollment=enrollment)
#         new_status = request.data.get("status")

#         if new_status not in ["Pending", "Approved", "Rejected"]:
#             return Response({"error": "Invalid status"}, status=400)

#         app.status = new_status
#         app.save()
#         return Response({"message": f"Application {app_id} updated to {new_status}"})
#     except JobApplication.DoesNotExist:
#         return Response({"error": "Application not found"}, status=404)


@api_view(['GET', 'POST'])
def official_reg(request):
    if request.method == 'GET':
        students = Officials_Registration.objects.all()
        serializer = OfficialsRegistrationSerializer(students, many=True)
        return Response(serializer.data)
    
    if request.method == 'POST':
        serializer = OfficialsRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# ------------------ OFFICIAL LOGIN (FIXED) ------------------
@api_view(['POST'])
def official_login(request):
     
    print("Request data:", request.data)

    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role')  # corrected field name

    try:
        official = Officials_Registration.objects.get(email=email, password=password, role=role)
        serializer = OfficialsRegistrationSerializer(official)
        return Response({
            "message": "Login successful",
            "user": serializer.data
        })
    except Officials_Registration.DoesNotExist:
        return Response({"error": "Invalid email, password, or role"}, status=400)


@api_view(['GET', 'POST','PUT'])
def employer_reg(request):
    if request.method == 'GET':
        Employer = Employer_Registration.objects.all()
        serializer = EmployerRegistrationSerializer(Employer, many=True)
        return Response(serializer.data)
    
    if request.method == 'POST':
        serializer = EmployerRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            # 🔥 Print errors in console for debugging
            print("❌ Employer Registration Error:")
            print(serializer.errors)
            return Response(serializer.errors, status=400)

    if request.method == 'PUT':
        id = request.data.get("id")
        try:
            school = Employer_Registration.objects.get(id=id)
            serializer = EmployerRegistrationSerializer(school, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save(status="Pending", rejection_reason="")
                return Response({"message": "School resubmitted successfully!"})
            return Response(serializer.errors, status=400)
        except Employer_Registration.DoesNotExist:
            return Response({"error": "School not found"}, status=404)


@api_view(['GET', 'PUT'])
def employer_detail(request, id):
    try:
        employer = Employer_Registration.objects.get(id=id)
    except Employer_Registration.DoesNotExist:
        return Response({"error": "school not found"}, status=404)

    if request.method == 'GET': 
        serializer = EmployerRegistrationSerializer(employer)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = EmployerRegistrationSerializer(employer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            # 🔥 Print errors in console for debugging
            print("❌ Employer Registration Error:")
            print(serializer.errors)
            return Response(serializer.errors, status=400)
        # return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT'])
def employer_updateReason(request, id):
    try:
        school = Employer_Registration.objects.get(id=id)
    except EmployerRegistrationSerializer.DoesNotExist:
        return Response({"error": "school not found"}, status=404)

    if request.method == 'GET': 
        serializer = EmployerRegistrationSerializer(school)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = EmployerRegistrationSerializer(school, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(status="Pending", rejection_reason="")
            return Response(serializer.data)
        else:
            # 🔥 Print errors in console for debugging
            print("❌ Employer Registration Error:")
            print(serializer.errors)
            return Response(serializer.errors, status=400)
        # return Response(serializer.errors, status=400)



@api_view(['POST'])
def employer_login(request):
    print("Request data:", request.data)

    enrollment = request.data.get('enrollment')
    password = request.data.get('password')

    try:
        employer = Employer_Registration.objects.get(enrollment=enrollment, password=password)
        serializer = EmployerRegistrationSerializer(employer)
        return Response({
            "message": "Login successful",
            "user": serializer.data
        })
    except Employer_Registration.DoesNotExist:
        return Response({"error": "Invalid enrollment or password"}, status=400)


@api_view(['GET'])
def employer_profile(request, enrollment):
    try:
        employer = Employer_Registration.objects.get(enrollment=enrollment)
        serializer = EmployerRegistrationSerializer(employer)
        return Response(serializer.data)
    except Employer_Registration.DoesNotExist:   
        print("❌ Employer Registration Error:")
        print(serializer.errors)
        return Response({'error': 'employer not found'}, status=404)
    

    
@api_view(['GET', 'POST'])
def vacancy_list(request):
    if request.method == 'GET':
        vacancies = Vacancy.objects.all()
        serializer = VacancySerializer(vacancies, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = VacancySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


@api_view(['GET', 'PUT', 'DELETE'])
def vacancy_detail(request, pk):
    try:
        vacancy = Vacancy.objects.get(pk=pk)
    except Vacancy.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = VacancySerializer(vacancy)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = VacancySerializer(vacancy, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        vacancy.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Other registration endpoints remain the same
@api_view(['GET', 'POST', 'PUT'])
def school_reg(request):
    if request.method == 'GET':
        schools = SchoolRegistration.objects.all()
        serializer = SchoolRegistrationSerializer(schools, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = SchoolRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(status="Pending")
            return Response({"message": "School registered successfully!", "data": serializer.data}, status=201)
        return Response(serializer.errors, status=400)

    if request.method == 'PUT':
        id = request.data.get("id")
        try:
            school = SchoolRegistration.objects.get(id=id)
            serializer = SchoolRegistrationSerializer(school, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save(status="Pending", rejection_reason="")
                return Response({"message": "School resubmitted successfully!"})
            return Response(serializer.errors, status=400)
        except SchoolRegistration.DoesNotExist:
            return Response({"error": "School not found"}, status=404)



@api_view(['POST'])
def school_login(request):
    # Log incoming request for debugging
    print("Request data:", request.data)

    email = request.data.get('email')
    password = request.data.get('password')

    # if not enrollment or not password:
    #     return Response({"error": "Enrollment and password are required"}, status=400)

    try:
        student = SchoolRegistration.objects.get(email=email, password=password)
        # print("student data:", student)
        serializer = SchoolRegistrationSerializer(student)
        return Response({
            "message": "Login successful",
            "user": serializer.data
        })
    except Student_Registration.DoesNotExist:
        # 400 response if student not found
        return Response({
            "error": "Invalid email or password"
        }, status=400)

@api_view(['GET', 'PUT'])
def school_detail(request, id):
    try:
        school = SchoolRegistration.objects.get(id=id)
    except SchoolRegistrationSerializer.DoesNotExist:
        return Response({"error": "school not found"}, status=404)

    if request.method == 'GET': 
        serializer = SchoolRegistrationSerializer(school)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = SchoolRegistrationSerializer(school, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            # 🔥 Print errors in console for debugging
            print("❌ Employer Registration Error:")
            print(serializer.errors)
            return Response(serializer.errors, status=400)
        # return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT'])
def school_updateReason(request, id):
    try:
        school = SchoolRegistration.objects.get(id=id)
    except SchoolRegistrationSerializer.DoesNotExist:
        return Response({"error": "school not found"}, status=404)

    if request.method == 'GET': 
        serializer = SchoolRegistrationSerializer(school)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = SchoolRegistrationSerializer(school, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(status="Pending", rejection_reason="")
            return Response(serializer.data)
        else:
            # 🔥 Print errors in console for debugging
            print("❌ Employer Registration Error:")
            print(serializer.errors)
            return Response(serializer.errors, status=400)
        # return Response(serializer.errors, status=400)


# @api_view(['GET', 'PUT'])
# def rejectionReasons(request, reason):
#     try:
#         school = SCHOOL_OR_COLLEGE_REGISTRATION.objects.get(rejection_reason=reason)
#     except SchoolRegistrationSerializer.DoesNotExist:
#         return Response({"error": "school not found"}, status=404)

#     if request.method == 'GET': 
#         serializer = SchoolRegistrationSerializer(school)
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         serializer = SchoolRegistrationSerializer(school, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=400)
    

@api_view(['GET'])
def school_profile(request, email):
    try:
        school = SchoolRegistration.objects.get(email=email)
        serializer = SchoolRegistrationSerializer(school)
        return Response(serializer.data)
    except Student_Registration.DoesNotExist:
        return Response({'error': 'school not found'}, status=404)

@api_view(['POST'])
def apply_vacancy(request):
    student_id = request.data.get('student_id')
    vacancy_id = request.data.get('vacancy_id')

    try:
        student = Student_Registration.objects.get(enrollment=student_id)
        vacancy = Vacancy.objects.get(id=vacancy_id)
    except Student_Registration.DoesNotExist:
        return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
    except Vacancy.DoesNotExist:
        return Response({"error": "Vacancy not found"}, status=status.HTTP_404_NOT_FOUND)

    application, created = JobApplication.objects.get_or_create(
        student=student,
        vacancy=vacancy,
        defaults={
            "applied": True,
            "status": "Applied"
        }
    )

    if not created:
        return Response({"message": "Already applied"}, status=status.HTTP_200_OK)

    serializer = JobApplicationSerializer(application)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def confirm_interview(request):
    student_id = request.data.get('student_id')
    vacancy_id = request.data.get('vacancy_id')

    try:
        student = Student_Registration.objects.get(enrollment=student_id)
        vacancy = Vacancy.objects.get(id=vacancy_id)
    except Student_Registration.DoesNotExist:
        return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
    except Vacancy.DoesNotExist:
        return Response({"error": "Vacancy not found"}, status=status.HTTP_404_NOT_FOUND)

    # Find or create the application
    application, created = JobApplication.objects.get_or_create(
        student=student,
        vacancy=vacancy,
        defaults={"applied": True, "status": "Approved by School"}
    )

    # Update confirmation
    application.confirmed_interview = True
    application.status = "Pending"
    application.save()

    serializer = JobApplicationSerializer(application)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_student_applications(request, enrollment):
    try:
        student = Student_Registration.objects.get(enrollment=enrollment)
        applications = JobApplication.objects.filter(student=student)
        data = [
            {
                "vacancy_id": app.vacancy.id,
                "status": app.status,
                "title": app.vacancy.title,
            }
            for app in applications
        ]
        return Response(data)
    except Student_Registration.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)


@api_view(["GET"])
def get_all_applications(request):
    apps = JobApplication.objects.select_related("student", "vacancy").all()
    data = [
        {
            "id": app.id,
            "Student": app.student.name,
            "Email": app.student.email,
            "School": app.student.school_name,
            "JobTitle": app.vacancy.title,
            "Status": app.status,
        }
        for app in apps
    ]
    return Response(data)


@api_view(["PATCH"])
def update_application_status(request, app_id):
    try:
        app = JobApplication.objects.get(id=app_id)
        new_status = request.data.get("status")

        if new_status not in ["Pending", "Approved", "Rejected"]:
            return Response({"error": "Invalid status"}, status=400)

        app.status = new_status
        app.save()
        return Response({"message": f"Application {app_id} updated to {new_status}"})
    except JobApplication.DoesNotExist:
        return Response({"error": "Application not found"}, status=404)

@api_view(['GET', 'POST'])
def company_reg(request):
    if request.method == 'GET':
        companies = Company_Registration.objects.all()
        serializer = CompanyRegistrationSerializer(companies, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = CompanyRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
@api_view(['GET', 'POST'])
def commission_reg(request):
    if request.method == 'GET':
        commissions = Commission_Registration.objects.all()
        serializer = CommissionRegistrationSerializer(commissions, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = CommissionRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


@api_view(["GET", "POST"])
def alo_reg(request):
    if request.method == "GET":
        registrations = ALO_Registration.objects.all()
        serializer = ALORegistrationSerializer(registrations, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = ALORegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    

@api_view(['GET', 'POST'])
def dlo_reg(request):
    if request.method == 'GET':
        dlos = DLO_Registration.objects.all()
        serializer = DLORegistrationSerializer(dlos, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = DLORegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
