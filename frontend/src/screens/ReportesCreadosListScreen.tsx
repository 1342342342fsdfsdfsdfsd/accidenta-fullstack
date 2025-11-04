import ReportsList from 'src/componentes/ReportsList';
import { fetchCreatedReports } from 'src/services/reportesService';

export default function ReportesCreadosListScreen() {
  return <ReportsList fetchFunction={fetchCreatedReports} />;
}
