using Data;
using Dtos;
using Entities;
using Microsoft.AspNetCore.Mvc;

namespace ec_notes.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VaultController : ControllerBase
{
    private readonly ILogger<VaultController> _logger;
    private readonly DbDataContext _dataContext;

    public VaultController(ILogger<VaultController> logger, DbDataContext dbData)
    {
        _logger = logger;
        _dataContext = dbData;
    }
    [HttpGet]
    [Route("{website}")]
    public async Task<IActionResult> Get(string website)
    {
        var site = _dataContext.EncryptedPayloads.FirstOrDefault(x => x.Website == website);
        if (site == null)
        {
            return await Task.FromResult(Ok(new Outbound()
            {
                DbVersion = 1,
                PreviousContentHash = string.Empty,
                Data = string.Empty,
                Website = website
            }));
        }
        else
        {
            return await Task.FromResult(Ok(new Outbound()
            {
                Data = site.Data,
                DbVersion = site.DbVersion,
                PreviousContentHash = null, 
                Website = site.Website,
            }));
        }
    }

    [HttpPost]
    [Route("{website}")]
    public async Task<IActionResult> Post([FromBody] Payload payload, string website)
    {
        var existingNote = _dataContext.EncryptedPayloads.FirstOrDefault(x => x.Website == website);
        if (existingNote != null)
        {            
            if (!string.IsNullOrEmpty(existingNote.PreviousContentHash))
            {
                if (payload.initialHashContent == existingNote.PreviousContentHash)
                {
                    existingNote.PreviousContentHash = payload.currentHashContent;
                    existingNote.Data = payload.encryptedContent;
                    existingNote.DateUpdated = DateTime.UtcNow;
                    _dataContext.Update<EncryptedPayload>(existingNote);
                }
                else{
                    return BadRequest();
                }
            }
        }
        else
        {         
            _dataContext.Add<EncryptedPayload>(new EncryptedPayload()
            {
                Data = payload.encryptedContent,
                DateCreated = DateTime.UtcNow,
                DateUpdated = DateTime.UtcNow,
                PreviousContentHash = payload.currentHashContent,
                DbVersion = 1,
                Website = website
            });

        }
        await _dataContext.SaveChangesAsync();
        return Ok();
    }
}
