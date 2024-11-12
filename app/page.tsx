'use client'

import { motion } from 'framer-motion'
import { Link } from '@nextui-org/react'
import { List, Plus, Trash2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Adminsitrador de <span className="text-yellow-300">Tareas</span>
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
      >
        <div className="flex justify-center space-x-4 mb-6">
          <FeatureIcon icon={<List size={24} />} label="Organizar" />
          <FeatureIcon icon={<Plus size={24} />} label="Crear" />
          <FeatureIcon icon={<Trash2 size={24} />} label="Eliminar" />
        </div>
        <Link href="/task" className="font-bold text-black text-center block bg-blue">
            Comienza a gestionar tareas
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 text-white text-center"
      >
        <div className="flex justify-center space-x-2">
          <Star />
          <Star />
          <Star />
          <Star />
          <Star />
        </div>
      </motion.div>
    </div>
  )
}

function FeatureIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="flex flex-col items-center"
    >
      <div className="bg-purple-100 p-3 rounded-full text-purple-600 mb-2">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </motion.div>
  )
}

function Star() {
  return (
    <motion.span
      whileHover={{ scale: 1.2 }}
      className="text-yellow-300 text-2xl"
    >
      ★
    </motion.span>
  )
}