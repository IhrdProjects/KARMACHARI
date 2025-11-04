from rest_framework import serializers
from .models import Student_Registration,Officials_Registration,Employer_Registration,Vacancy, SchoolRegistration, JobApplication, ALO_Registration, DLO_Registration, Company_Registration, Commission_Registration

class StudentRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student_Registration
        fields = '__all__'

class OfficialsRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Officials_Registration
        fields = '__all__'

class EmployerRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employer_Registration
        fields = '__all__'
        
class VacancySerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacancy
        fields = '__all__'

class SchoolRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolRegistration
        fields = "__all__"


class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = "__all__"

class ALORegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ALO_Registration
        fields = "__all__"


class DLORegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DLO_Registration
        fields = '__all__'

class CompanyRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company_Registration
        fields = "__all__"

class CommissionRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commission_Registration
        fields = "__all__"