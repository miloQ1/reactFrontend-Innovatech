import { useState, useEffect } from 'react';
import { professionalService } from '../../api/projectService';
import styles from './ProfessionalModal.module.css';

interface ProfessionalModalProps {
  professional: any | null;
  onClose: () => void;
  onSave: () => void;
}

export function ProfessionalModal({ professional, onClose, onSave }: ProfessionalModalProps) {
  const [form, setForm] = useState({
    firstName:           '',
    lastName:            '',
    email:               '',
    employeeCode:        '',
    roleName:            '',
    seniority:           'MID',
    location:            '',
    timeZone:            'America/Santiago',
    weeklyCapacityHours: 40,
    status:              'ACTIVE',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (professional) {
      setForm({
        firstName:           professional.firstName ?? '',
        lastName:            professional.lastName ?? '',
        email:               professional.email ?? '',
        employeeCode:        professional.employeeCode ?? '',
        roleName:            professional.roleName ?? '',
        seniority:           professional.seniority ?? 'MID',
        location:            professional.location ?? '',
        timeZone:            professional.timeZone ?? 'America/Santiago',
        weeklyCapacityHours: professional.weeklyCapacityHours ?? 40,
        status:              professional.status ?? 'ACTIVE',
      });
    }
  }, [professional]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'weeklyCapacityHours' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (professional) {
        await professionalService.update(professional.resourceId, form);
      } else {
        await professionalService.create(form);
      }
      onSave();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {professional ? 'Editar profesional' : 'Nuevo profesional'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Nombre *</label>
              <input className={styles.input} name="firstName"
                value={form.firstName} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Apellido *</label>
              <input className={styles.input} name="lastName"
                value={form.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email *</label>
            <input className={styles.input} name="email" type="email"
              value={form.email} onChange={handleChange} required />
          </div>

          <div className={styles.row}>
            {professional?.employeeCode && (
            <div className={styles.field}>
              <label className={styles.label}>Código empleado</label>
              <span className={styles.employeeCode}>
                {professional.employeeCode}
              </span>
            </div>
          )}
            <div className={styles.field}>
              <label className={styles.label}>Rol</label>
              <input className={styles.input} name="roleName"
                value={form.roleName} onChange={handleChange}
                placeholder="Backend Developer" />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Seniority</label>
              <select className={styles.input} name="seniority"
                value={form.seniority} onChange={handleChange}>
                <option value="JUNIOR">Junior</option>
                <option value="MID">Mid</option>
                <option value="SENIOR">Senior</option>
                <option value="LEAD">Lead</option>
                <option value="PRINCIPAL">Principal</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Estado</label>
              <select className={styles.input} name="status"
                value={form.status} onChange={handleChange}>
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
                <option value="ON_LEAVE">Con licencia</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Ubicación</label>
              <input className={styles.input} name="location"
                value={form.location} onChange={handleChange}
                placeholder="Santiago, Chile" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Capacidad (h/semana)</label>
              <input className={styles.input} name="weeklyCapacityHours"
                type="number" min={1} max={60}
                value={form.weeklyCapacityHours} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Guardando...' : professional ? 'Guardar cambios' : 'Crear profesional'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}