import React from 'react';

type StatusBadgeProps = {
    status: 'learning' | 'coding' | 'debugging' | 'done';
};

const statusConfig = {
    learning: {
        label: '学習中',
        bgColor: 'bg-blue-100 dark:bg-blue-900',
        textColor: 'text-blue-800 dark:text-blue-200',
        icon: '📚',
    },
    coding: {
        label: '実装中',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900',
        textColor: 'text-yellow-800 dark:text-yellow-200',
        icon: '💻',
    },
    debugging: {
        label: 'デバッグ中',
        bgColor: 'bg-orange-100 dark:bg-orange-900',
        textColor: 'text-orange-800 dark:text-orange-200',
        icon: '🐛',
    },
    done: {
        label: '完了',
        bgColor: 'bg-green-100 dark:bg-green-900',
        textColor: 'text-green-800 dark:text-green-200',
        icon: '✅',
    },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}
        >
            <span>{config.icon}</span>
            <span>{config.label}</span>
        </span>
    );
}
