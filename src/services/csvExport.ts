
import { Creator } from '../types/Creator';

export const exportCreatorsToCSV = (creators: Creator[]) => {
  // Define CSV headers
  const headers = [
    'Name',
    'Genre',
    'Platform',
    'Social Link',
    'Location',
    'Phone Number',
    'Media Kit',
    'Bio',
    'Followers',
    'Total Views',
    'Average Views',
    'Avatar URL',
    'Created At',
    'Updated At'
  ];

  // Convert creators to CSV rows
  const rows = creators.map(creator => [
    creator.name || '',
    creator.genre || '',
    creator.platform || '',
    creator.socialLink || '',
    creator.location || '',
    creator.phoneNumber || '',
    creator.mediaKit || '',
    creator.details?.bio || '',
    creator.details?.analytics?.followers || 0,
    creator.details?.analytics?.totalViews || 0,
    creator.details?.analytics?.averageViews || 0,
    creator.avatar || '',
    creator.createdAt || '',
    creator.updatedAt || ''
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => 
      row.map(field => 
        // Escape quotes and wrap in quotes if contains comma or quote
        typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))
          ? `"${field.replace(/"/g, '""')}"`
          : field
      ).join(',')
    )
    .join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `creators_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
