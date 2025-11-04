import ReportsList from 'src/componentes/ReportsList';
import { fetchReportsWhereUserIsInvolved } from 'src/services/reportesService';

export default function ReportesComoAccidentadoListScreen() {
  return <ReportsList fetchFunction={fetchReportsWhereUserIsInvolved} />;
}
