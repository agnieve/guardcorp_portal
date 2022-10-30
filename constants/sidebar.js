
import { ChartBarIcon,
    BellAlertIcon,
    ClipboardDocumentListIcon,
    LightBulbIcon,
    UserGroupIcon,
    BuildingOfficeIcon,
    UserIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/solid';

export const sidebarContent = [
    {
        title: 'Reports',
        sidebars: [
            {
                label: 'Overview',
                link: '/overview',
                icon: <ChartBarIcon className="h-6 w-6 text-white" />
            },
            {
                label: 'Alerts',
                link: '/alerts',
                icon: <BellAlertIcon className="h-6 w-6 text-white" />
            },
            {
                label: 'Shifts',
                link:'/shifts',
                icon: <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
            },
            {
                label:'Events',
                link: '/events',
                icon: <LightBulbIcon className="h-6 w-6 text-white" />
            }
        ]
    },
    {
        title: 'Administration',
        sidebars: [
            {
                label:'Clients',
                link: '/clients',
                icon: <UserGroupIcon className="h-6 w-6 text-white" />
            },
            {
                label:'Sites',
                link: '/sites',
                icon: <BuildingOfficeIcon className="h-6 w-6 text-white" />
            },
            {
                label:'Users',
                link: '/users',
                icon: <UserIcon className="h-6 w-6 text-white" />
            },
            {
                label:'Activities',
                link: '/activities',
                icon: <RocketLaunchIcon className="h-6 w-6 text-white" />
            },
        ]
    }
];