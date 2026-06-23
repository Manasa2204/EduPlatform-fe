import { Component } from '@angular/core';

@Component({ selector: 'app-hire-talent-landing', templateUrl: './landing.component.html', styleUrls: ['./landing.component.scss'] })
export class HireTalentLandingComponent {
  reasons = [
    { icon: '💰', title: 'Earn More', desc: 'Set your own rates. Top instructors earn ₹5L+ per month.' },
    { icon: '🌍', title: 'Global Reach', desc: 'Teach students across 50+ countries on our platform.' },
    { icon: '🛠️', title: 'Full Support', desc: 'We handle marketing, payments, and platform management.' },
    { icon: '📈', title: 'Grow Your Brand', desc: 'Build authority and get recognized as an industry expert.' },
    { icon: '⏰', title: 'Flexible Schedule', desc: 'Teach on your own time. Full-time or part-time - your choice.' },
    { icon: '🎓', title: 'Impact Lives', desc: 'Change careers. Students land top jobs with your guidance.' },
  ];

  steps = [
    { num: '01', title: 'Apply', desc: 'Fill out our simple application with your expertise details.' },
    { num: '02', title: 'Get Reviewed', desc: 'Our admin team reviews your profile within 48 hours.' },
    { num: '03', title: 'Create Course', desc: 'Work with our team to create your first course.' },
    { num: '04', title: 'Start Teaching', desc: 'Go live and start earning immediately.' },
  ];
}
