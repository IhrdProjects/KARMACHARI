from django.db import models

class Student_Registration(models.Model):
    # Personal details
    name = models.CharField(max_length=100)
    parent_name = models.CharField(max_length=100)
    dob = models.DateField()
    age = models.PositiveIntegerField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    emergency = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(unique=True)
    gender = models.CharField(
        max_length=10,
        choices=[("Male", "Male"), ("Female", "Female"), ("Other", "Other")],
        blank=True,
        null=True
    )

    # Academic & residence details
    school_name = models.CharField(max_length=200)
    district = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    course = models.CharField(max_length=100, blank=True, null=True)
    interests = models.JSONField(default=list, blank=True, null=True)

    # Upload documents
    id_card = models.FileField(upload_to="documents/id_cards/", blank=True, null=True)
    resume = models.FileField(upload_to="documents/resumes/", blank=True, null=True)
    consent = models.FileField(upload_to="documents/consents/", blank=True, null=True)
    photo = models.ImageField(upload_to="documents/photos/", blank=True, null=True)

    enrollment = models.CharField(max_length=200)
    password = models.CharField(max_length=200)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.email})"


class Officials_Registration(models.Model):
    fullName = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)  # Added phone field
    password = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.fullName} ({self.email})"

class Employer_Registration(models.Model):
    businessName = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    gstNumber = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    irn = models.CharField(max_length=100)  # Labour Reg. Number
    category = models.CharField(max_length=50)
    address = models.CharField(max_length=200)
    district = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    password = models.CharField(max_length=200)
    enrollment = models.CharField(max_length=100, unique=True)

    # File uploads
    documents = models.FileField(upload_to="documents/Employer/")
    eoiLetter = models.FileField(upload_to="documents/Employer/eoi/", blank=True, null=True)
    certificate = models.FileField(upload_to="documents/Employer/certificate/", blank=True, null=True)
    
    status = models.CharField(max_length=50, default="Pending")  # Pending, Approved, Rejected, Resubmitted
    rejection_reason = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.businessName} ({self.enrollment})"



class Vacancy(models.Model):
    title = models.CharField(max_length=100)
    employer = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    positions = models.IntegerField()
    validTill = models.DateField()
    interviewDate = models.DateField()
    interviewTime = models.TimeField()
    appliedStudents = models.IntegerField()

    def __str__(self):
        return self.title


class SchoolRegistration(models.Model):
    principal = models.CharField(max_length=100)
    name = models.CharField(max_length=200)  # School / College name
    phone = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=200)
    district = models.CharField(max_length=100)
    eol_letter = models.FileField(upload_to="documents/eoi_letters/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="Pending")  # Pending, Approved, Rejected, Resubmitted
    rejection_reason = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.email})"



class JobApplication(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Rejected", "Rejected"),
    ]

    student = models.ForeignKey('Student_Registration', on_delete=models.CASCADE)
    vacancy = models.ForeignKey('Vacancy', on_delete=models.CASCADE)
    applied = models.BooleanField(default=False)
    confirmed_interview = models.BooleanField(default=False)
    applied_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="Pending")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.name} - {self.vacancy.title} ({self.status})"


class ALO_Registration(models.Model):
    name = models.CharField(max_length=200)
    phone_no = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True)
    district = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.district}"


class DLO_Registration(models.Model):
    name = models.CharField(max_length=200)
    phone_no = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True)
    district = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.district}"
    
class Company_Registration(models.Model):
    # Basic company details
    name = models.CharField(max_length=200)  
    phone = models.CharField(max_length=15)  
    gst_number = models.CharField(max_length=50, unique=True)  
    email = models.EmailField(unique=True)  
    lrn = models.CharField(max_length=100, unique=True, verbose_name="Labour Registration Number")  

    # Category & location
    category = models.CharField(max_length=100)  
    district = models.CharField(max_length=100)  

    # Address & description
    address = models.TextField()  
    description = models.TextField(blank=True, null=True)  

    # File uploads
    eoi_letter = models.FileField(upload_to="documents/company/eoi_letters/", blank=True, null=True)  
    registration_certificate = models.FileField(upload_to="documents/company/certificates/", blank=True, null=True)  

    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.email})"


class Commission_Registration(models.Model):
    name = models.CharField(max_length=150)
    phone_no = models.CharField(max_length=15)
    email = models.EmailField(unique=True)

    created_at = models.DateTimeField(auto_now_add=True)  # when record created
    updated_at = models.DateTimeField(auto_now=True)      # when record updated

    def __str__(self):
        return f"{self.name} - {self.email}"

