import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrganizationSelection from '../components/identification/OrganizationSelection';
import BrandSelection from '../components/identification/BrandSelection';
import RegionSelection from '../components/identification/RegionSelection';
import RegionalManagerSelection from '../components/identification/RegionalManagerSelection';
import RoleSelection from '../components/identification/RoleSelection';
import AgeSelection from '../components/identification/AgeSelection';
import EducationSelection from '../components/identification/EducationSelection';
import ExperienceSelection from '../components/identification/ExperienceSelection';
import DepartmentSelection from '../components/identification/DepartmentSelection';
import SenioritySelection from '../components/identification/SenioritySelection';

const AGE_GROUPS = [
  { id: '18_24', title: '18-24 ani' },
  { id: '25_34', title: '25-34 ani' },
  { id: '35_44', title: '35-44 ani' },
  { id: '45_54', title: '45-54 ani' },
  { id: '55_plus', title: '55+ ani' },
];

export default function IdentificationScreen() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(null);
  const [brand, setBrand] = useState(null);
  const [region, setRegion] = useState(null);
  const [department, setDepartment] = useState(null);
  const [seniority, setSeniority] = useState(null);
  const [manager, setManager] = useState(null);
  const [retailRole, setRetailRole] = useState(null);
  const [ageGroup, setAgeGroup] = useState(null);
  const [education, setEducation] = useState(null);
  const [experience, setExperience] = useState(null);
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (selected === 'retail_group') {
      setStep(2);
    } else if (selected === 'sediul_central') {
      localStorage.setItem('user_group', selected);
      setStep(3);
    }
  };

  const handleBrandConfirm = () => {
    if (brand) {
      localStorage.setItem('brand', brand);
      setStep(3);
    }
  };

  const handleRegionConfirm = () => {
    if (region) {
      localStorage.setItem('region', region);
      if (selected === 'sediul_central') {
        setStep(4); // Go to department selection for central office
      } else {
        setStep(4); // Go to regional manager selection for retail
      }
    }
  };

  const handleDepartmentConfirm = () => {
    if (department) {
      localStorage.setItem('department', department);
      setStep(5); // Go to seniority selection
    }
  };

  const handleSeniorityConfirm = () => {
    if (seniority) {
      localStorage.setItem('seniority', seniority);
      setStep(6); // Go to age selection
    }
  };

  const handleManagerConfirm = () => {
    if (manager) {
      localStorage.setItem('regional_manager', manager);
      setStep(5);
    }
  };

  const handleRoleConfirm = () => {
    if (retailRole) {
      localStorage.setItem('user_group', 'retail_group');
      localStorage.setItem('retail_role', retailRole);
      setStep(6);
    }
  };

  const handleAgeConfirm = () => {
    if (ageGroup) {
      localStorage.setItem('age_group', ageGroup);
      setStep(7);
    }
  };

  const handleEducationConfirm = () => {
    if (education) {
      localStorage.setItem('education', education);
      setStep(8);
    }
  };

  const handleExperienceConfirm = () => {
    if (experience) {
      localStorage.setItem('experience', experience);
      navigate('/instructions');
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setBrand(null);
    } else if (step === 3) {
      if (selected === 'retail_group') {
        setStep(2);
      } else {
        setStep(1);
      }
      setRegion(null);
    } else if (step === 4) {
      if (selected === 'sediul_central') {
        setStep(3);
        setDepartment(null);
      } else {
        setStep(3);
        setManager(null);
      }
    } else if (step === 5) {
      if (selected === 'sediul_central') {
        setStep(4); // Go back to department from seniority
        setSeniority(null);
      } else {
        setStep(4);
        setRetailRole(null);
      }
    } else if (step === 6) {
      if (selected === 'sediul_central') {
        setStep(5); // Go back to seniority from age
      } else {
        setStep(5); // Go back to role from age
      }
      setAgeGroup(null);
    } else if (step === 7) {
      setStep(6);
      setEducation(null);
    } else if (step === 8) {
      setStep(7);
      setExperience(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {step === 1 && (
        <OrganizationSelection
          selected={selected}
          onSelect={setSelected}
          onConfirm={handleConfirm}
        />
      )}

      {step === 2 && (
        <BrandSelection
          brand={brand}
          onSelect={setBrand}
          onBack={handleBack}
          onConfirm={handleBrandConfirm}
        />
      )}

      {step === 3 && (
        <RegionSelection
          region={region}
          onSelect={setRegion}
          onBack={handleBack}
          onConfirm={handleRegionConfirm}
          isCentralOffice={selected === 'sediul_central'}
        />
      )}

      {step === 4 && selected === 'sediul_central' && (
        <DepartmentSelection
          department={department}
          onSelect={setDepartment}
          onBack={handleBack}
          onConfirm={handleDepartmentConfirm}
        />
      )}

      {step === 4 && selected === 'retail_group' && (
        <RegionalManagerSelection
          manager={manager}
          onSelect={setManager}
          onBack={handleBack}
          onConfirm={handleManagerConfirm}
        />
      )}

      {step === 5 && selected === 'sediul_central' && (
        <SenioritySelection
          seniority={seniority}
          onSelect={setSeniority}
          onBack={handleBack}
          onConfirm={handleSeniorityConfirm}
        />
      )}

      {step === 5 && selected === 'retail_group' && (
        <RoleSelection
          role={retailRole}
          onSelect={setRetailRole}
          onBack={handleBack}
          onConfirm={handleRoleConfirm}
        />
      )}

      {step === 6 && (
        <AgeSelection
          age={ageGroup}
          onSelect={setAgeGroup}
          onBack={handleBack}
          onConfirm={handleAgeConfirm}
        />
      )}

      {step === 7 && (
        <EducationSelection
          education={education}
          onSelect={setEducation}
          onBack={handleBack}
          onConfirm={handleEducationConfirm}
        />
      )}

      {step === 8 && (
        <ExperienceSelection
          experience={experience}
          onSelect={setExperience}
          onBack={handleBack}
          onConfirm={handleExperienceConfirm}
        />
      )}
    </div>
  );
} 