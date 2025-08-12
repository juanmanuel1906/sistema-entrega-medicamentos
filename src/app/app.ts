import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
declare const Swal: any; // Declare Swal to avoid TypeScript errors

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  // Static Data Simulation
  currentUser: any = null; // Stores current logged-in user object
  currentUserId: string | null = null; // A simple ID for the current user session
  currentUserRole: string | null = null; // 'patient' or 'pharmacist'

  // Pre-defined static users for demo login
  staticUsers: any[] = [
    { id: 'patient-123', email: 'paciente@demo.com', password: 'password123', name: 'Ana García', document: '123456789', dob: '1960-01-01', contact: '+57 300 1112233', role: 'patient', turnsTaken: 0 },
    { id: 'pharmacist-456', email: 'farmaceutico@demo.com', password: 'password123', name: 'Dr. Carlos Ruiz', document: '987654321', dob: '1985-05-10', contact: '+57 300 4445566', role: 'pharmacist' }
  ];

  // Static medicine inventory
  staticMedicines: any[] = [
    { id: 'med001', name: 'Paracetamol', description: 'Analgésico y antipirético', dose: '500', unit: 'mg', expiryDate: '2026-12-31', lot: 'P-1234', quantityAvailable: 150 },
    { id: 'med002', name: 'Ibuprofeno', description: 'Antiinflamatorio no esteroideo', dose: '400', unit: 'mg', expiryDate: '2027-06-30', lot: 'I-5678', quantityAvailable: 80 },
    { id: 'med003', name: 'Amoxicilina', description: 'Antibiótico de amplio espectro', dose: '250', unit: 'mg/5ml', expiryDate: '2025-09-15', lot: 'A-9012', quantityAvailable: 30 },
    { id: 'med004', name: 'Omeprazol', description: 'Inhibidor de la bomba de protones', dose: '20', unit: 'mg', expiryDate: '2028-03-20', lot: 'O-3456', quantityAvailable: 120 },
    { id: 'med005', name: 'Salbutamol', description: 'Broncodilatador', dose: '100', unit: 'mcg', expiryDate: '2026-10-01', lot: 'S-7890', quantityAvailable: 40 },
  ];

  // Static requests (for pharmacist to manage, and patient to see their own)
  staticRequests: any[] = [
    { id: 'req001', patientUid: 'patient-123', patientName: 'Ana García', medicineId: 'med001', medicineName: 'Paracetamol', requestDate: '2025-07-20T10:30:00Z', status: 'Pending', deliveryType: 'delivery', documentUploaded: true, responseMessage: '', pharmacistUid: null, turnScheduled: true },
    { id: 'req002', patientUid: 'patient-123', patientName: 'Ana García', medicineId: 'med003', medicineName: 'Amoxicilina', requestDate: '2025-07-21T14:00:00Z', status: 'Approved', deliveryType: 'pickup', documentUploaded: false, responseMessage: 'Receta validada. Disponible para recogida.', pharmacistUid: 'pharmacist-456', turnScheduled: true },
    { id: 'req003', patientUid: 'patient-simulado-01', patientName: 'Juan Prueba', medicineId: 'med004', medicineName: 'Omeprazol', requestDate: '2025-07-22T09:15:00Z', status: 'Rejected', deliveryType: 'delivery', documentUploaded: true, responseMessage: 'Receta inválida, por favor, suba una nueva.', pharmacistUid: 'pharmacist-456', turnScheduled: true },
  ];

  // Form input models
  regEmail: string = '';
  regPassword = '';
  regName = '';
  regDocument = '';
  regDob = '';
  regContact = '';
  regRole: 'patient' | 'pharmacist' = 'patient';

  loginEmail = '';
  loginPassword = '';

  // UI state for loading/messages
  loading = false;
  authMessage = '';
  showLoginForm = true; // Controls which form is visible
  requestMessage = '';
  // Removed modalMessage and showModal as they are handled by Swal

  // Patient dashboard specific data for *ngFor
  medicineSearchInput = '';
  filteredMedicines: any[] = []; // Data for medicine consultation list
  patientRequests: any[] = []; // Data for patient's requests list
  selectedMedicineId = '';
  selectedMedicineName = '';
  deliveryType: 'pickup' | 'delivery' = 'pickup';
  documentUploadFiles: FileList | null = null; // Simulate file input

  // Pharmacist dashboard specific data for *ngFor
  pharmacistInventory: any[] = []; // Data for inventory list
  pharmacistPendingRequests: any[] = []; // Data for pending requests list
  addMedicineName = '';
  addMedicineQuantity: number | null = null;
  addMedicineDescription = '';
  addMedicineDose = '';
  addMedicineUnit = '';
  addMedicineExpiry = '';
  addMedicineLot = '';

  ngOnInit() {
    this.updateUIForLoggedOut();
    // Initialize the filtered medicines for display on load
    this.filteredMedicines = [...this.staticMedicines];
  }

  // --- Utility Functions ---

  toggleLoading(isLoading: boolean) {
    this.loading = isLoading;
  }

  // Replaced showAppModal with Swal.fire
  showSwal(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question') {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition duration-300 ease-in-out'
      },
      buttonsStyling: false
    });
  }

  // --- Authentication Handlers ---

  async register() {
    this.toggleLoading(true);
    this.authMessage = '';

    if (!this.regEmail || !this.regPassword || !this.regName || !this.regDocument || !this.regDob || !this.regContact) {
      this.authMessage = "Todos los campos son obligatorios.";
      this.toggleLoading(false);
      return;
    }

    const age = new Date().getFullYear() - new Date(this.regDob).getFullYear();
    if (this.regRole === 'patient' && age < 18) {
      this.authMessage = "El paciente debe ser mayor de 18 años.";
      this.toggleLoading(false);
      return;
    }

    // Simulate successful registration
    this.showSwal("Registro Exitoso", "Ahora puedes iniciar sesión con tus credenciales.", "success");
    // Reset form fields
    this.regEmail = '';
    this.regPassword = '';
    this.regName = '';
    this.regDocument = '';
    this.regDob = '';
    this.regContact = '';

    this.showLoginForm = true; // Switch to login form
    this.toggleLoading(false);
  }

  async login() {
    this.toggleLoading(true);
    this.authMessage = '';

    if (!this.loginEmail || !this.loginPassword) {
      this.authMessage = "Correo electrónico y contraseña son obligatorios.";
      this.toggleLoading(false);
      return;
    }

    const user = this.staticUsers.find(u => u.email === this.loginEmail && u.password === this.loginPassword);

    if (user) {
      this.currentUser = user;
      this.currentUserId = user.id;
      this.currentUserRole = user.role;
      this.showSwal("Inicio de Sesión Exitoso", `Bienvenido, ${user.name}!`, "success");
      this.updateUI();
    } else {
      this.authMessage = "Credenciales inválidas.";
      this.showSwal("Error de Inicio de Sesión", "Credenciales inválidas. Por favor, verifica tu correo y contraseña.", "error");
    }
    this.toggleLoading(false);
  }

  logout() {
    this.currentUser = null;
    this.currentUserId = null;
    this.currentUserRole = null;
    this.showSwal("Sesión Cerrada", "Has cerrado tu sesión correctamente.", "info");
    this.updateUIForLoggedOut();
  }

  showLogin() {
    this.showLoginForm = true;
    this.authMessage = '';
  }

  showRegister() {
    this.showLoginForm = false;
    this.authMessage = '';
  }

  // --- UI Update Functions ---

  updateUI() {
    this.showLoginForm = false; // Ensure login/register forms are hidden
    if (this.currentUserRole === 'patient') {
      this.updateTurnsInfo(this.currentUser.turnsTaken || 0);
      this.filteredMedicines = [...this.staticMedicines]; // Initial full list for patient view
      this.patientRequests = [...this.staticRequests.filter(req => req.patientUid === this.currentUserId)];
    } else if (this.currentUserRole === 'pharmacist') {
      this.pharmacistInventory = [...this.staticMedicines]; // All medicines for inventory
      this.pharmacistPendingRequests = [...this.staticRequests.filter(req => req.status === 'Pending' || req.status === 'Approved')];
    }
    this.toggleLoading(false);
  }

  updateUIForLoggedOut() {
    this.currentUser = null;
    this.currentUserId = null;
    this.currentUserRole = null;
    this.showLoginForm = true; // Back to login form
    this.toggleLoading(false);
  }

  updateTurnsInfo(turnsTaken: number) {
    const turnsInfoElement = document.getElementById('turns-info');
    const maxTurns = 2; // Defined in requirements
    if (turnsInfoElement) {
      turnsInfoElement.textContent = `Tienes ${turnsTaken} de ${maxTurns} turnos apartados.`;
      const submitBtn = document.getElementById('submit-request-btn') as HTMLButtonElement;
      const submitBtnText = document.getElementById('submit-request-btn-text');

      if (turnsTaken >= maxTurns) {
        turnsInfoElement.classList.add('text-red-600');
        if (submitBtn) submitBtn.disabled = true;
        if (submitBtnText) submitBtnText.textContent = 'Máximo de turnos alcanzado';
      } else {
        turnsInfoElement.classList.remove('text-red-600');
        if (submitBtn) submitBtn.disabled = false;
        if (submitBtnText) submitBtnText.textContent = 'Solicitar Entrega / Recogida';
      }
    }
  }

  // --- Medicine Management (Patient View) ---

  searchMedicine() {
    const searchTerm = this.medicineSearchInput.toLowerCase();
    this.filteredMedicines = this.staticMedicines.filter(med =>
      med.name.toLowerCase().includes(searchTerm) ||
      med.id.toLowerCase().includes(searchTerm)
    );
    // Angular will automatically re-render the *ngFor list
  }

  selectMedicine(id: string, name: string) {
    this.selectedMedicineId = id;
    this.selectedMedicineName = name;
    this.showSwal("Medicamento Seleccionado", `Has seleccionado ${this.selectedMedicineName} para solicitar.`, "info");
  }

  // --- Request & Delivery (Patient View) ---

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.documentUploadFiles = input.files;
    }
  }

  async submitRequest() {
    this.toggleLoading(true);
    this.requestMessage = '';

    if (!this.selectedMedicineId || !this.selectedMedicineName) {
      this.requestMessage = "Por favor, selecciona un medicamento.";
      this.showSwal("Error de Solicitud", "Por favor, selecciona un medicamento antes de enviar la solicitud.", "error");
      this.toggleLoading(false);
      return;
    }

    // Check if user has reached turn limit
    const patientUser = this.staticUsers.find(u => u.id === this.currentUserId && u.role === 'patient');
    if (patientUser && patientUser.turnsTaken >= 2) {
      this.showSwal("Límite de Turnos Alcanzado", "Ya has apartado el máximo de 2 turnos.", "warning");
      this.toggleLoading(false);
      return;
    }

    // Simulate adding request
    const newRequestId = 'req' + (this.staticRequests.length + 1).toString().padStart(3, '0');
    const newRequest = {
      id: newRequestId,
      patientUid: this.currentUserId,
      patientName: this.currentUser.name,
      medicineId: this.selectedMedicineId,
      medicineName: this.selectedMedicineName,
      requestDate: new Date().toISOString(),
      status: 'Pending',
      deliveryType: this.deliveryType,
      documentUploaded: (this.documentUploadFiles && this.documentUploadFiles.length > 0),
      responseMessage: '',
      pharmacistUid: null,
      turnScheduled: true
    };
    this.staticRequests.push(newRequest);

    // Increment turns taken for the patient (locally)
    if (patientUser) {
      patientUser.turnsTaken = (patientUser.turnsTaken || 0) + 1;
      this.updateTurnsInfo(patientUser.turnsTaken);
    }
    
    this.showSwal("Solicitud Enviada", "Tu solicitud ha sido enviada con éxito y tu turno ha sido apartado.", "success");
    this.requestMessage = "Solicitud enviada con éxito.";
    // Clear form fields
    this.selectedMedicineId = '';
    this.selectedMedicineName = '';
    this.documentUploadFiles = null; // Clear file input reference
    (document.getElementById('document-upload') as HTMLInputElement).value = ''; // Clear actual file input

    // Update patient's requests list
    this.patientRequests = [...this.staticRequests.filter(req => req.patientUid === this.currentUserId)];
    this.patientRequests.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());

    // Update pharmacist's pending requests list
    this.pharmacistPendingRequests = [...this.staticRequests.filter(req => req.status === 'Pending' || req.status === 'Approved')];
    this.pharmacistPendingRequests.sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime());

    this.toggleLoading(false);
  }

  getStatusColorClass(status: string) {
    switch (status) {
      case 'Pending': return 'text-yellow-600';
      case 'Approved': return 'text-blue-600';
      case 'Rejected': return 'text-red-600';
      case 'Delivered': return 'text-green-600';
      default: return 'text-gray-600';
    }
  }

  // --- Inventory Management (Pharmacist View) ---

  async addMedicine() {
    this.toggleLoading(true);

    if (!this.addMedicineName || this.addMedicineQuantity === null || this.addMedicineQuantity < 0 || !this.addMedicineDescription || !this.addMedicineDose || !this.addMedicineUnit || !this.addMedicineExpiry || !this.addMedicineLot) {
      this.showSwal("Error de Formulario", "Todos los campos de medicamento son obligatorios y la cantidad debe ser un número positivo.", "error");
      this.toggleLoading(false);
      return;
    }

    // Simulate adding medicine
    const newMedicineId = 'med' + (this.staticMedicines.length + 1).toString().padStart(3, '0');
    const newMedicine = {
      id: newMedicineId,
      name: this.addMedicineName,
      quantityAvailable: this.addMedicineQuantity,
      description: this.addMedicineDescription,
      dose: this.addMedicineDose,
      unit: this.addMedicineUnit,
      expiryDate: this.addMedicineExpiry,
      lot: this.addMedicineLot,
    };
    this.staticMedicines.push(newMedicine);
    
    this.showSwal("Medicamento Agregado", "El medicamento ha sido agregado al inventario exitosamente (localmente).", "success");
    // Clear form
    this.addMedicineName = '';
    this.addMedicineQuantity = null;
    this.addMedicineDescription = '';
    this.addMedicineDose = '';
    this.addMedicineUnit = '';
    this.addMedicineExpiry = '';
    this.addMedicineLot = '';

    // Update lists
    this.pharmacistInventory = [...this.staticMedicines]; // Re-render inventory
    this.pharmacistInventory.sort((a, b) => a.name.localeCompare(b.name));
    this.filteredMedicines = [...this.staticMedicines]; // Re-render patient's view of medicines

    this.toggleLoading(false);
  }

  updateInventoryQuantity(med: any, action: 'increase' | 'decrease') {
    const medicineToUpdate = this.pharmacistInventory.find(m => m.id === med.id);
    if (medicineToUpdate) {
      if (action === 'increase') {
        medicineToUpdate.quantityAvailable++;
      } else if (action === 'decrease' && medicineToUpdate.quantityAvailable > 0) {
        medicineToUpdate.quantityAvailable--;
      }
    }
  }

  saveInventoryQuantity(med: any) {
    this.toggleLoading(true);
    const medicineIndex = this.staticMedicines.findIndex(m => m.id === med.id);
    if (medicineIndex !== -1) {
      this.staticMedicines[medicineIndex].quantityAvailable = med.quantityAvailable;
      this.showSwal("Cantidad Actualizada", "La cantidad ha sido actualizada exitosamente (localmente).", "success");
    } else {
      this.showSwal("Error", "Medicamento no encontrado.", "error");
    }
    // Update lists after saving
    this.pharmacistInventory = [...this.staticMedicines];
    this.pharmacistInventory.sort((a, b) => a.name.localeCompare(b.name));
    this.filteredMedicines = [...this.staticMedicines];
    this.toggleLoading(false);
  }

  deleteMedicine(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto! Esta acción solo se aplica localmente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition duration-300 ease-in-out mr-2',
        cancelButton: 'bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition duration-300 ease-in-out ml-2'
      },
      buttonsStyling: false
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.toggleLoading(true);
        this.staticMedicines = this.staticMedicines.filter(m => m.id !== id);
        this.showSwal("¡Eliminado!", "El medicamento ha sido eliminado (localmente).", "success");
        // Update lists after deleting
        this.pharmacistInventory = [...this.staticMedicines];
        this.pharmacistInventory.sort((a, b) => a.name.localeCompare(b.name));
        this.filteredMedicines = [...this.staticMedicines];
        this.toggleLoading(false);
      }
    });
  }

  // --- Pending Requests (Pharmacist View) ---

  updateRequestStatus(req: any) {
    this.toggleLoading(true);
    const requestIndex = this.staticRequests.findIndex(r => r.id === req.id);
    if (requestIndex !== -1) {
      // Update the request in the main staticRequests array
      this.staticRequests[requestIndex].status = req.status;
      this.staticRequests[requestIndex].responseMessage = req.responseMessage;
      this.staticRequests[requestIndex].pharmacistUid = this.currentUserId;

      // If status changes to 'Delivered', decrement turnsTaken for the patient (locally)
      const patientUser = this.staticUsers.find(u => u.id === req.patientUid && u.role === 'patient');
      if (req.status === 'Delivered' && patientUser && patientUser.turnsTaken > 0) {
        patientUser.turnsTaken = patientUser.turnsTaken - 1;
        // If the current user *is* the patient whose request was delivered, update their UI
        if (this.currentUserId === req.patientUid && this.currentUserRole === 'patient') {
          this.updateTurnsInfo(patientUser.turnsTaken);
        }
      }
      this.showSwal("Solicitud Actualizada", `La solicitud ${req.id} ha sido actualizada a "${req.status}" (localmente).`, "success");
    } else {
      this.showSwal("Error", `Solicitud ${req.id} no encontrada.`, "error");
    }
    // Re-render lists
    this.pharmacistPendingRequests = [...this.staticRequests.filter(r => r.status === 'Pending' || r.status === 'Approved')];
    this.pharmacistPendingRequests.sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime());
    
    this.patientRequests = [...this.staticRequests.filter(r => r.patientUid === this.currentUserId)];
    this.patientRequests.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());

    this.toggleLoading(false);
  }
}
