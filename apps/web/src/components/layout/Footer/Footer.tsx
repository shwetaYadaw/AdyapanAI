import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: '#ffffff',
      padding: '60px 40px 30px',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: '60px',
        marginBottom: '40px',
      }}>
        {/* Left Section - About */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #E85D04, #F48C06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#fff',
              fontSize: '14px',
            }}>
              ady.
            </div>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Adyapan</span>
          </div>
          <p style={{
            fontSize: '13px',
            lineHeight: '1.6',
            color: '#b0b0b0',
            marginBottom: '20px',
          }}>
            Transforming India's talent landscape through industry-relevant education, real-world experience, and career-focused programs.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
              background: 'linear-gradient(135deg, #E85D04, #F48C06)',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              📷 Instagram
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{
              background: 'linear-gradient(135deg, #E85D04, #F48C06)',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              💼 LinkedIn
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{
              background: 'linear-gradient(135deg, #E85D04, #F48C06)',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              📺 YouTube
            </a>
          </div>
        </div>

        {/* Platform Section */}
        <div>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#E85D04',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '20px',
          }}>
            Platform
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {['Programs', 'About Us', 'Gallery', 'Campus Ambassador', 'Hire Talent', 'Marketplace'].map((item) => (
              <li key={item} style={{ marginBottom: '12px' }}>
                <a href="#" style={{
                  color: '#b0b0b0',
                  textDecoration: 'none',
                  fontSize: '13px',
                  transition: 'color 0.3s',
                }}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Section */}
        <div>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#E85D04',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '20px',
          }}>
            Legal
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {['Privacy Policy', 'Terms of Service', 'Support', 'Contact Us'].map((item) => (
              <li key={item} style={{ marginBottom: '12px' }}>
                <a href="#" style={{
                  color: '#b0b0b0',
                  textDecoration: 'none',
                  fontSize: '13px',
                  transition: 'color 0.3s',
                }}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#E85D04',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '20px',
          }}>
            Contact
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Phone size={16} style={{ color: '#E85D04' }} />
              <a href="tel:+918178124566" style={{
                color: '#b0b0b0',
                textDecoration: 'none',
                fontSize: '13px',
              }}>
                +91 81781 24566
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={16} style={{ color: '#E85D04' }} />
              <a href="mailto:support@adyapan.com" style={{
                color: '#b0b0b0',
                textDecoration: 'none',
                fontSize: '13px',
              }}>
                support@adyapan.com
              </a>
            </div>
          </div>

          {/* Head Office */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#E85D04',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}>
              Head Office
            </h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              <MapPin size={16} style={{ color: '#E85D04', flexShrink: 0, marginTop: '2px' }} />
              <p style={{
                fontSize: '12px',
                color: '#b0b0b0',
                margin: 0,
                lineHeight: '1.4',
              }}>
                Adyapan Edutech Pvt Ltd<br />
                Saif-o Mirgolis, Sancia Colony, Toli Chowki, Hyderabad, Telangana 500008
              </p>
            </div>
          </div>

          {/* Second Branch */}
          <div>
            <h4 style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#E85D04',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}>
              Second Branch
            </h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              <MapPin size={16} style={{ color: '#E85D04', flexShrink: 0, marginTop: '2px' }} />
              <p style={{
                fontSize: '12px',
                color: '#b0b0b0',
                margin: 0,
                lineHeight: '1.4',
              }}>
                Adyapan Edutech Pvt Ltd<br />
                Banashankari 3rd Stage, Mahalakshmi Rd, Bengaluru, Karnataka 560076
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Border */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '20px',
        textAlign: 'center',
        color: '#888',
        fontSize: '12px',
      }}>
        <p style={{ margin: 0 }}>© 2024 Adyapan. All rights reserved.</p>
      </div>
    </footer>
  );
}
