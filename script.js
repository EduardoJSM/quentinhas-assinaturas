// script for saving and loading signature profiles using localStorage
function onlyDigits(s){ return String(s||'').replace(/\D/g,''); }
function formatCPF(input){ const d = onlyDigits(input); if(d.length<=3) return d; if(d.length<=6) return d.replace(/(\d{3})(\d+)/,'$1.$2'); if(d.length<=9) return d.replace(/(\d{3})(\d{3})(\d+)/,'$1.$2.$3'); return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2}).*/,'$1.$2.$3-$4'); }

function setPreviewText(text, styleClass){
  const pv = document.getElementById('preview');
  pv.textContent = text || 'Pré-visualização da assinatura';
  for(let i=1;i<=10;i++){ pv.classList.remove('sig-'+i); }
  if(styleClass) pv.classList.add(styleClass);
}

function saveProfile(){
  const nome = document.getElementById('nome').value.trim();
  const cpfRaw = document.getElementById('cpf').value.trim();
  const cpf = onlyDigits(cpfRaw);
  const assinatura = document.getElementById('assinatura').value.trim();
  const estilo = document.getElementById('estilo').value;
  if(!nome || cpf.length!==11 || !assinatura){ alert('Preencha nome, CPF (11 dígitos) e assinatura.'); return; }
  const perfis = JSON.parse(localStorage.getItem('perfis')||'{}');
  perfis[cpf] = { nome, cpf: formatCPF(cpf), assinatura, estilo, savedAt: new Date().toISOString() };
  localStorage.setItem('perfis', JSON.stringify(perfis));
  alert('Perfil salvo com sucesso!');
}

function loadProfileByCPF(cpfInput){
  const cpf = onlyDigits(cpfInput||'');
  if(cpf.length!==11) return null;
  const perfis = JSON.parse(localStorage.getItem('perfis')||'{}');
  return perfis[cpf] || null;
}

document.addEventListener('DOMContentLoaded', ()=>{
  const nome = document.getElementById('nome');
  const cpf = document.getElementById('cpf');
  const assinatura = document.getElementById('assinatura');
  const estilo = document.getElementById('estilo');
  const saveBtn = document.getElementById('saveBtn');
  const clearBtn = document.getElementById('clearBtn');
  const loadBtn = document.getElementById('loadBtn');
  const cpfConfirm = document.getElementById('cpfConfirm');
  const loadedInfo = document.getElementById('loadedInfo');
  const confirmArea = document.getElementById('confirmArea');
  const confirmBtn = document.getElementById('confirmBtn');

  function updatePreview(){ setPreviewText(assinatura.value, estilo.value); }
  assinatura && assinatura.addEventListener('input', updatePreview);
  estilo && estilo.addEventListener('change', updatePreview);
  nome && nome.addEventListener('input', ()=>{ if(!assinatura.value) setPreviewText(nome.value, estilo.value); });

  saveBtn && saveBtn.addEventListener('click', saveProfile);
  clearBtn && clearBtn.addEventListener('click', ()=>{ if(confirm('Apagar todos os perfis salvos no navegador?')){ localStorage.removeItem('perfis'); alert('Perfis apagados'); }});

  loadBtn && loadBtn.addEventListener('click', ()=>{
    const cpfVal = cpfConfirm.value || '';
    const profile = loadProfileByCPF(cpfVal);
    if(profile){
      loadedInfo.style.display='block';
      loadedInfo.innerHTML = '<strong>'+profile.nome+'</strong><div class="'+profile.estilo+'" style="margin-top:8px; font-size:22px">'+profile.assinatura+'</div><div style="margin-top:6px; color:#666">Salvo em: '+ new Date(profile.savedAt).toLocaleString() +'</div>';
      confirmArea.style.display='block';
    } else {
      loadedInfo.style.display='block';
      loadedInfo.innerHTML = '<em>Perfil não encontrado.</em>';
      confirmArea.style.display='none';
    }
  });

  confirmBtn && confirmBtn.addEventListener('click', ()=>{
    const cpfVal = cpfConfirm.value || '';
    const profile = loadProfileByCPF(cpfVal);
    if(!profile){ alert('Perfil não encontrado para confirmar.'); return; }
    const regs = JSON.parse(localStorage.getItem('registros')||'[]');
    regs.unshift({ cpf: profile.cpf, nome: profile.nome, assinatura: profile.assinatura, estilo: profile.estilo, ts: new Date().toISOString() });
    localStorage.setItem('registros', JSON.stringify(regs));
    alert('Recebimento confirmado para ' + profile.nome);
  });

  cpfConfirm && cpfConfirm.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ loadBtn.click(); }});
  [cpf, cpfConfirm].forEach(inp => { if(!inp) return; inp.addEventListener('input', (e)=>{ e.target.value = formatCPF(e.target.value); }); });

  const cpfView = document.getElementById('cpfView');
  const viewBtn = document.getElementById('viewBtn');
  const viewResult = document.getElementById('viewResult');
  if(viewBtn){
    viewBtn.addEventListener('click', ()=>{
      const p = loadProfileByCPF(cpfView.value);
      if(p){ viewResult.style.display='block'; viewResult.innerHTML = '<strong>'+p.nome+'</strong><div class="'+p.estilo+'" style="margin-top:8px; font-size:26px">'+p.assinatura+'</div><div style="margin-top:6px; color:#666">Salvo em: '+ new Date(p.savedAt).toLocaleString() +'</div>'; } else { viewResult.style.display='block'; viewResult.innerHTML = '<em>Perfil não encontrado.</em>'; }
    });
    cpfView.addEventListener('keydown', (e)=>{ if(e.key==='Enter') viewBtn.click(); });
    cpfView.addEventListener('input', (e)=>{ e.target.value = formatCPF(e.target.value); });
  }

  updatePreview();
});
