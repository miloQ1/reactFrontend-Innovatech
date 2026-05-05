import { useState, useEffect } from 'react';
import { professionalService } from '../api/projectService';
import { ProfessionalModal } from '../components/resources/ProfessionalModal';
import { ConfirmModal } from '../components/shared/ConfirmModal';
import styles from './ResourcesPage.module.css';

const SENIORITY_COLOR: Record<string, string> = {
  JUNIOR:    '#059669',
  MID:       '#d97706',
  SENIOR:    '#2563eb',
  LEAD:      '#7c3aed',
  PRINCIPAL: '#be185d',
};

export function ResourcesPage() {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');
  const [filterStatus, setFilterStatus]   = useState('ALL');
  const [selectedPro, setSelectedPro]     = useState<any | null>(null);
  const [showModal, setShowModal]         = useState(false);
  const [confirmModal, setConfirmModal]   = useState<{
    title: string; message: string; onConfirm: () => void;
  } | null>(null);

  const loadProfessionals = async () => {
    setLoading(true);
    try {
      const data = await professionalService.getAll();
      setProfessionals(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfessionals(); }, []);

  const handleDelete = (pro: any) => {
    setConfirmModal({
      title: `Eliminar a ${pro.firstName} ${pro.lastName}`,
      message: 'Esta acción eliminará el profesional permanentemente.',
      onConfirm: async () => {
        setConfirmModal(null);
        await professionalService.delete(pro.resourceId).catch(() => {});
        loadProfessionals();
      },
    });
  };

  const filtered = professionals.filter(p => {
    const matchSearch = `${p.firstName} ${p.lastName} ${p.email} ${p.roleName}`
      .toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>👥 Recursos Humanos</h1>
          <p className={styles.subtitle}>
            {professionals.length} profesionales registrados
          </p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => { setSelectedPro(null); setShowModal(true); }}
        >
          ＋ Agregar profesional
        </button>
      </div>

      {/* ── Filtros ── */}
      <div className={styles.filters}>
        <input
          className={styles.search}
          placeholder="Buscar por nombre, email o rol..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className={styles.select}
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="ALL">Todos los estados</option>
          <option value="ACTIVE">Activo</option>
          <option value="INACTIVE">Inactivo</option>
          <option value="ON_LEAVE">Con licencia</option>
        </select>
      </div>

      {/* ── Lista ── */}
      {loading ? (
        <div className={styles.loading}>Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>👤</div>
          <p className={styles.emptyTitle}>No hay profesionales</p>
          <p className={styles.emptyDesc}>
            {search ? 'No se encontraron resultados para tu búsqueda.' : 'Agrega el primer profesional del equipo.'}
          </p>
          {!search && (
            <button
              className={styles.addBtn}
              onClick={() => { setSelectedPro(null); setShowModal(true); }}
            >
              ＋ Agregar profesional
            </button>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(pro => (
            <div key={pro.resourceId} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  {pro.firstName?.charAt(0)}{pro.lastName?.charAt(0)}
                </div>
                <div className={styles.cardInfo}>
                  <span className={styles.name}>
                    {pro.firstName} {pro.lastName}
                  </span>
                  <span className={styles.role}>{pro.roleName ?? '—'}</span>
                </div>
                <span className={`${styles.statusBadge} ${pro.status === 'ACTIVE' ? styles.statusActive : styles.statusInactive}`}>
                  {pro.status}
                </span>
              </div>

              <div className={styles.cardBody}>
                {pro.email && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Email</span>
                    <span className={styles.infoValue}>{pro.email}</span>
                  </div>
                )}
                {pro.seniority && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Seniority</span>
                    <span
                      className={styles.seniorityBadge}
                      style={{
                        color: SENIORITY_COLOR[pro.seniority] ?? '#64748b',
                        background: (SENIORITY_COLOR[pro.seniority] ?? '#64748b') + '18',
                      }}
                    >
                      {pro.seniority}
                    </span>
                  </div>
                )}
                {pro.weeklyCapacityHours && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Capacidad</span>
                    <span className={styles.infoValue}>{pro.weeklyCapacityHours}h/semana</span>
                  </div>
                )}
                {pro.location && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Ubicación</span>
                    <span className={styles.infoValue}>{pro.location}</span>
                  </div>
                )}
              </div>

              <div className={styles.cardFooter}>
                <button
                  className={styles.editBtn}
                  onClick={() => { setSelectedPro(pro); setShowModal(true); }}
                >
                  ✏️ Editar
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(pro)}
                >
                  🗑 Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <ProfessionalModal
          professional={selectedPro}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); loadProfessionals(); }}
        />
      )}

      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel="Eliminar"
          danger
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
}