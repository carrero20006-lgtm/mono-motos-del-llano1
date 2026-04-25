import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createClient } from '@supabase/supabase-js';

interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: 'cliente' | 'admin';
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  time: string;
}

interface Appointment {
  id?: number;
  client_name: string;
  client_email: string;
  service: string;
  date: string;
  time: string;
  motorcycle: string;
  description: string;
  status: 'Pendiente' | 'En proceso' | 'Finalizado';
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  supabase = createClient(
    'https://dkxkygqwerukhkyodvxd.supabase.co',
    'sb_publishable_UfZStVvYV_jaQ8apu1sEaw_zqe4Zd-U'
  );

  logo = '/assets/logo-mono-motos.png';

  currentUser: User | null = null;
  users: User[] = [];
  appointments: Appointment[] = [];

  isRegisterMode = false;

  loginEmail = '';
  loginPassword = '';

  registerName = '';
  registerEmail = '';
  registerPassword = '';

  selectedService = '';
  appointmentDate = '';
  appointmentTime = '';
  motorcycle = '';
  problemDescription = '';

  searchText = '';
  statusFilter = 'Todos';

  message = '';
  messageType: 'success' | 'error' = 'success';

  services: Service[] = [
    {
      id: 1,
      name: 'Mantenimiento',
      description: 'Revisión completa, lubricación, ajustes generales y prevención de fallas.',
      price: '$80.000',
      time: '1 - 2 horas'
    },
    {
      id: 2,
      name: 'Cambio de aceite',
      description: 'Cambio de aceite, filtro y revisión básica del motor.',
      price: '$45.000',
      time: '40 minutos'
    },
    {
      id: 3,
      name: 'Diagnóstico',
      description: 'Evaluación general para detectar fallas mecánicas o eléctricas.',
      price: '$35.000',
      time: '30 minutos'
    },
    {
      id: 4,
      name: 'Eléctrico',
      description: 'Revisión de luces, batería, cableado y sistema de encendido.',
      price: '$60.000',
      time: '1 hora'
    },
    {
      id: 5,
      name: 'Frenos',
      description: 'Ajuste, revisión y cambio de pastillas o bandas de freno.',
      price: '$70.000',
      time: '1 hora'
    },
    {
      id: 6,
      name: 'Motor',
      description: 'Reparación, sincronización y mantenimiento del motor.',
      price: 'Desde $120.000',
      time: 'Según diagnóstico'
    }
  ];

  constructor() {
    this.loadInitialData();
  }

  async loadInitialData() {
    await this.loadUsers();
    await this.loadAppointments();

    const savedUser = localStorage.getItem('currentUser');

    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  showMessage(text: string, type: 'success' | 'error' = 'success') {
    this.message = text;
    this.messageType = type;

    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  async loadUsers() {
    const { data, error } = await this.supabase
      .from('app_users')
      .select('*');

    if (error) {
      this.showMessage('Error cargando usuarios', 'error');
      console.error(error.message);
      return;
    }

    this.users = data as User[];
  }

  async loadAppointments() {
    const { data, error } = await this.supabase
      .from('appointments')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      this.showMessage('Error cargando citas', 'error');
      console.error(error.message);
      return;
    }

    this.appointments = data as Appointment[];
  }

  async login() {
    const { data, error } = await this.supabase
      .from('app_users')
      .select('*')
      .eq('email', this.loginEmail)
      .eq('password', this.loginPassword)
      .single();

    if (error || !data) {
      this.showMessage('Correo o contraseña incorrectos', 'error');
      return;
    }

    this.currentUser = data as User;
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

    this.loginEmail = '';
    this.loginPassword = '';

    await this.loadAppointments();

    this.showMessage(`Bienvenida/o ${this.currentUser.name} ✅`);
  }

  async register() {
    if (!this.registerName || !this.registerEmail || !this.registerPassword) {
      this.showMessage('Completa todos los campos', 'error');
      return;
    }

    const newUser: User = {
      name: this.registerName,
      email: this.registerEmail,
      password: this.registerPassword,
      role: 'cliente'
    };

    const { data, error } = await this.supabase
      .from('app_users')
      .insert([newUser])
      .select()
      .single();

    if (error) {
      this.showMessage('No se pudo crear el usuario. El correo puede estar repetido.', 'error');
      console.error(error.message);
      return;
    }

    this.currentUser = data as User;
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

    this.registerName = '';
    this.registerEmail = '';
    this.registerPassword = '';
    this.isRegisterMode = false;

    await this.loadUsers();
    await this.loadAppointments();

    this.showMessage('Cuenta creada correctamente ✅');
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.showMessage('Sesión cerrada');
  }

  selectService(serviceName: string) {
    this.selectedService = serviceName;
    document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' });
  }

  async createAppointment() {
    if (!this.currentUser) {
      this.showMessage('Debes iniciar sesión', 'error');
      return;
    }

    if (!this.selectedService || !this.appointmentDate || !this.appointmentTime || !this.motorcycle) {
      this.showMessage('Completa servicio, fecha, hora y moto', 'error');
      return;
    }

    const appointment: Appointment = {
      client_name: this.currentUser.name,
      client_email: this.currentUser.email,
      service: this.selectedService,
      date: this.appointmentDate,
      time: this.appointmentTime,
      motorcycle: this.motorcycle,
      description: this.problemDescription || 'Sin descripción adicional',
      status: 'Pendiente'
    };

    const { error } = await this.supabase
      .from('appointments')
      .insert([appointment]);

    if (error) {
      this.showMessage('No se pudo registrar la cita', 'error');
      console.error(error.message);
      return;
    }

    this.selectedService = '';
    this.appointmentDate = '';
    this.appointmentTime = '';
    this.motorcycle = '';
    this.problemDescription = '';

    await this.loadAppointments();

    this.showMessage('Cita registrada correctamente ✅');
  }

  async updateStatus(id: number | undefined, status: 'Pendiente' | 'En proceso' | 'Finalizado') {
    if (!id) return;

    const { error } = await this.supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) {
      this.showMessage('No se pudo actualizar el estado', 'error');
      console.error(error.message);
      return;
    }

    await this.loadAppointments();

    this.showMessage(`Estado actualizado a: ${status} ✅`);
  }

  async deleteAppointment(id: number | undefined) {
    if (!id) return;

    const confirmDelete = confirm('¿Seguro que quieres eliminar esta cita?');

    if (!confirmDelete) return;

    const { error } = await this.supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      this.showMessage('No se pudo eliminar la cita', 'error');
      console.error(error.message);
      return;
    }

    await this.loadAppointments();

    this.showMessage('Cita eliminada correctamente ✅');
  }

  get visibleAppointments(): Appointment[] {
    let data = this.appointments;

    if (this.currentUser?.role === 'cliente') {
      data = data.filter(item => item.client_email === this.currentUser?.email);
    }

    if (this.statusFilter !== 'Todos') {
      data = data.filter(item => item.status === this.statusFilter);
    }

    if (this.searchText.trim()) {
      const text = this.searchText.toLowerCase();

      data = data.filter(item =>
        item.client_name.toLowerCase().includes(text) ||
        item.client_email.toLowerCase().includes(text) ||
        item.service.toLowerCase().includes(text) ||
        item.motorcycle.toLowerCase().includes(text)
      );
    }

    return data;
  }

  get totalAppointments(): number {
    return this.visibleAppointments.length;
  }

  get pendingAppointments(): number {
    return this.visibleAppointments.filter(item => item.status === 'Pendiente').length;
  }

  get processAppointments(): number {
    return this.visibleAppointments.filter(item => item.status === 'En proceso').length;
  }

  get finishedAppointments(): number {
    return this.visibleAppointments.filter(item => item.status === 'Finalizado').length;
  }
}