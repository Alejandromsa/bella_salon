import { render, screen } from '@testing-library/react'
import Home from '../src/app/page'
import '@testing-library/jest-dom'

describe('Home', () => {
    it('renders a heading', () => {
        render(<Home />)

        const heading = screen.getByRole('heading', {
            name: /Realza tu Belleza Natural/i,
        })

        expect(heading).toBeInTheDocument()
    })

    it('renders links to services and booking', () => {
        render(<Home />)

        const servicesLink = screen.getByRole('link', { name: /Ver Servicios/i });
        const bookingLink = screen.getByRole('link', { name: /Reservar Cita/i });

        expect(servicesLink).toBeInTheDocument();
        expect(bookingLink).toBeInTheDocument();
    })
})
