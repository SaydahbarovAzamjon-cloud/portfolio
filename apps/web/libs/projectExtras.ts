import { StaticImageData } from 'next/image';
import fixoraHero from '../public/img/projects/fixora/hero.webp';
import fixoraSearch from '../public/img/projects/fixora/search.webp';
import fixoraMobile from '../public/img/projects/fixora/mobile.webp';
import fixoraTechnician from '../public/img/projects/fixora/technician.webp';
import fixoraAdmin from '../public/img/projects/fixora/admin.webp';
import carviaAnalysis from '../public/img/projects/carvia/analysis.webp';
import carviaDevices from '../public/img/projects/carvia/devices.webp';
import gadgetProducts from '../public/img/projects/gadget-store/products.webp';
import gadgetAdmin from '../public/img/projects/gadget-store/admin-welcome.webp';
import gadgetAdminProducts from '../public/img/projects/gadget-store/admin-products.webp';
import gadgetOrders from '../public/img/projects/gadget-store/orders.webp';
import gadgetProduct from '../public/img/projects/gadget-store/product.webp';
import foodWorkspace from '../public/img/projects/foodai/workspace.webp';
import foodAnalysis from '../public/img/projects/foodai/analysis.webp';

/**
 * What the projects page shows on top of the project data: screenshots (from the portfolio PDF)
 * and the one number or fact that sells each project (text in projects.metric.<slug>).
 */
export interface ProjectExtra {
	/** the card / main screenshot */
	cover?: StaticImageData;
	/** more screens, used by the flagship block and the case study */
	gallery: StaticImageData[];
	/** a big value shown in the metric pill, if the project has one; the label is in projects.metric.<slug> */
	metricValue?: string;
}

export const PROJECT_EXTRAS: Record<string, ProjectExtra> = {
	fixora: { cover: fixoraHero, gallery: [fixoraSearch, fixoraTechnician, fixoraAdmin, fixoraMobile] },
	carvia: { cover: carviaAnalysis, gallery: [carviaDevices], metricValue: '88.3%' },
	'gadget-store': { cover: gadgetProducts, gallery: [gadgetAdmin, gadgetAdminProducts, gadgetOrders, gadgetProduct] },
	foodai: { cover: foodWorkspace, gallery: [foodAnalysis], metricValue: '35.8 ms' },
	lumora: { gallery: [] },
};

/** The flagship project gets the big block at the top of the page. */
export const FLAGSHIP_SLUG = 'fixora';
