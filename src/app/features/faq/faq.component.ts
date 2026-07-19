import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-faq',
  standalone: true,
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  protected readonly openFaq = signal<string | null>(null);
  protected readonly searchTerm = signal('');
  protected readonly selectedCategory = signal('all');

  protected readonly faqs = [
    {
      id: '1',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for all items. Items must be in original condition with tags attached.',
      category: 'Returns'
    },
    {
      id: '2',
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery.',
      category: 'Shipping'
    },
    {
      id: '3',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. International shipping times vary by location.',
      category: 'Shipping'
    },
    {
      id: '4',
      question: 'How can I track my order?',
      answer: 'Once your order ships, you will receive a tracking number via email to monitor your package.',
      category: 'Orders'
    },
    {
      id: '5',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, Apple Pay, and Google Pay.',
      category: 'Payment'
    }
  ];

  protected readonly categories = ['all', ...Array.from(new Set(this.faqs.map((faq) => faq.category)))];

  protected get filteredFaqs() {
    return this.faqs.filter((faq) => {
      const matchesSearch = faq.question.toLowerCase().includes(this.searchTerm().toLowerCase()) || faq.answer.toLowerCase().includes(this.searchTerm().toLowerCase());
      const matchesCategory = this.selectedCategory() === 'all' || faq.category === this.selectedCategory();
      return matchesSearch && matchesCategory;
    });
  }

  protected toggleFaq(id: string): void {
    this.openFaq.set(this.openFaq() === id ? null : id);
  }

  protected clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('all');
  }

  protected contactSupport(): void {
    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=brahmahandicrafts@gmail.com', '_blank', 'noopener,noreferrer');
  }
}
