using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ImageAPI.Models;

namespace ImageAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EncodeStringsController : ControllerBase
    {
        private readonly EncodeContext _context;

        public EncodeStringsController(EncodeContext context)
        {
            _context = context;
        }

        // GET: api/EncodeStrings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EncodeString>>> GetEncodeStrings()
        {
          if (_context.EncodeStrings == null)
          {
              return NotFound();
          }
            return await _context.EncodeStrings.ToListAsync();
        }

        // GET: api/EncodeStrings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EncodeString>> GetEncodeString(int id)
        {
          if (_context.EncodeStrings == null)
          {
              return NotFound();
          }
            var encodeString = await _context.EncodeStrings.FindAsync(id);

            if (encodeString == null)
            {
                return NotFound();
            }

            return encodeString;
        }

        // PUT: api/EncodeStrings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEncodeString(int id, EncodeString encodeString)
        {
            if (id != encodeString.Id)
            {
                return BadRequest();
            }

            _context.Entry(encodeString).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EncodeStringExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/EncodeStrings
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<EncodeString>> PostEncodeString(EncodeString encodeString)
        {
          if (_context.EncodeStrings == null)
          {
              return Problem("Entity set 'EncodeContext.EncodeStrings'  is null.");
          }
            _context.EncodeStrings.Add(encodeString);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEncodeString", new { id = encodeString.Id }, encodeString);
        }

        // DELETE: api/EncodeStrings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEncodeString(int id)
        {
            if (_context.EncodeStrings == null)
            {
                return NotFound();
            }
            var encodeString = await _context.EncodeStrings.FindAsync(id);
            if (encodeString == null)
            {
                return NotFound();
            }

            _context.EncodeStrings.Remove(encodeString);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EncodeStringExists(int id)
        {
            return (_context.EncodeStrings?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
